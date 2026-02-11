/**
 * Ralph 外层控制器脚本
 *
 * 功能：
 * 1. 循环调用 iflow
 * 2. 读取 prd.json 并将上下文传递给内层 AI
 * 3. 5 分钟后强制终止 iflow（防止 Context 污染）
 * 4. 支持 Ctrl+C 优雅退出
 */

import { spawn } from 'child_process';
import * as fs from 'fs/promises';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TIME_LIMIT = 5 * 60 * 1000; // 5 分钟
const SLEEP_BETWEEN = 2000; // 2 秒
const PRD_PATH = 'nanospec/ralph/prd.json';

/**
 * 读取 prd.json 文件
 */
async function readPrd(): Promise<any> {
  try {
    const content = await fs.readFile(PRD_PATH, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    console.warn(`⚠️  无法读取 prd.json: ${PRD_PATH}`);
    console.warn('   请先创建 prd.json 文件');
    return null;
  }
}

/**
 * 构造系统提示
 */
function buildSystemPrompt(prd: any): string {
  if (!prd) {
    return `
你是 Ralph 自动化流水线中的 Worker。

当前状态：未找到 prd.json 文件。

请按以下步骤操作：
1. 使用 "nanospec new <任务名>" 创建第一个任务
2. 创建 nanospec/ralph/prd.json 文件，初始化任务队列
3. 继续执行 NanoSpec 工作流
`;
  }

  const activeTask = prd.tasks.find((t: any) => t.status === 'in_progress');
  const pendingTask = prd.tasks.find((t: any) => t.status === 'pending');

  let instruction = `
你是 Ralph 自动化流水线中的 Worker。

## 当前上下文

项目：${prd.project}
版本：${prd.version}
最后更新：${prd.last_updated}

## 任务队列

${prd.tasks.map((t: any) => {
  const statusIcon = t.status === 'completed' ? '✅' : t.status === 'in_progress' ? '🔄' : '⏳';
  return `${statusIcon} [${t.id}] ${t.title} - ${t.status}${t.phase ? ` (${t.phase})` : ''}${t.progress_note ? ` - ${t.progress_note}` : ''}`;
}).join('\n')}

${prd.ralph_instruction ? `\n## 指令\n${prd.ralph_instruction}\n` : ''}

## 你需要做什么

`;

  if (activeTask) {
    instruction += `
当前正在执行的任务：[${activeTask.id}] ${activeTask.title}
当前阶段：${activeTask.phase || 'unknown'}
进度：${activeTask.progress_note || '开始'}

请按以下步骤操作：
1. 如果还没有 nanospec 任务目录，使用 "nanospec new" 创建
2. 切换到任务目录：nanospec switch ${activeTask.nanospec_file || '<任务名>'}
3. 根据 phase 状态执行对应的 NanoSpec 命令：
   - phase="spec": 执行 /spec.1-spec，完成后更新 phase="plan"
   - phase="plan": 执行 /spec.2-plan，完成后更新 phase="execute"
   - phase="execute": 执行 /spec.3-execute，完成后更新 phase="review"
   - phase="review": 运行质量检查，完成后更新 status="completed"
4. 每完成一步，立即更新 prd.json 的 phase 和 progress_note
5. 如果任务需要拆分，直接修改 prd.json 添加新任务
`;

    if (activeTask.nanospec_file) {
      instruction += `\n当前任务目录：${activeTask.nanospec_file}\n`;
    }
  } else if (pendingTask) {
    instruction += `
没有进行中的任务，下一个待处理任务：[${pendingTask.id}] ${pendingTask.title}

请按以下步骤操作：
1. 使用 "nanospec new ${pendingTask.title}" 创建任务目录
2. 更新 prd.json，设置该任务的 nanospec_file 和 status="in_progress"
3. 开始执行 NanoSpec 工作流
`;
  } else {
    instruction += `
所有任务已完成！
`;
  }

  return instruction;
}

/**
 * 运行单个 iflow 会话
 */
async function runIflowSession(): Promise<void> {
  const startTime = Date.now();
  console.log('Starting iflow session...\n');

  // 读取 prd.json
  const prd = await readPrd();

  // 构造系统提示
  const systemPrompt = buildSystemPrompt(prd);
  console.log('--- System Prompt ---');
  console.log(systemPrompt);
  console.log('--- End System Prompt ---\n');

  // 调用 iflow，通过 stdin 传递系统提示
  const iflowProcess = spawn('iflow', ['-y'], {
    stdio: ['pipe', 'pipe', 'pipe'],
    shell: true, // Windows 兼容性
  });

  // 写入系统提示到 stdin
  iflowProcess.stdin.write(systemPrompt);
  iflowProcess.stdin.end();

  // 实时输出 iflow 的 stdout 和 stderr
  iflowProcess.stdout.on('data', (data) => {
    process.stdout.write(data);
  });

  iflowProcess.stderr.on('data', (data) => {
    process.stderr.write(data);
  });

  // 超时终止
  const timeoutId = setTimeout(() => {
    if (!iflowProcess.killed) {
      console.log('\n⏰ Time limit reached, killing iflow...');
      iflowProcess.kill('SIGTERM');
    }
  }, TIME_LIMIT);

  // 等待进程结束
  await new Promise<void>((resolve) => {
    iflowProcess.on('close', (code) => {
      clearTimeout(timeoutId);
      const elapsed = Date.now() - startTime;
      console.log(`\nSession ended (code: ${code}, elapsed: ${elapsed / 1000}s)`);
      resolve();
    });
  });

  // 如果进程还没被杀死，确保杀死
  if (!iflowProcess.killed) {
    iflowProcess.kill('SIGKILL');
  }
}

/**
 * 主循环
 */
async function main() {
  console.log('='.repeat(64));
  console.log('  Ralph - NanoSpec Outer Controller');
  console.log('='.repeat(64));
  console.log(`Time limit per session: ${TIME_LIMIT / 1000}s`);
  console.log(`Sleep between sessions: ${SLEEP_BETWEEN / 1000}s`);
  console.log(`PRD file: ${PRD_PATH}`);
  console.log('Press Ctrl+C to stop.\n');

  let iteration = 0;

  while (true) {
    iteration++;
    console.log('─'.repeat(64));
    console.log(`  Iteration ${iteration}`);
    console.log('─'.repeat(64));

    try {
      await runIflowSession();
    } catch (error) {
      console.error('Error running iflow session:', error);
    }

    console.log('\nSleeping before next session...\n');
    await sleep(SLEEP_BETWEEN);
  }
}

/**
 * 延迟函数
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// 优雅退出
process.on('SIGINT', () => {
  console.log('\n\n👋 Ralph stopped by user.');
  process.exit(0);
});

// 错误处理
process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

main();