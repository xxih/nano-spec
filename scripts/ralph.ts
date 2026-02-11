/**
 * Ralph 外层控制器脚本
 *
 * 功能：
 * 1. 循环调用 iflow
 * 2. 实时输出 iflow 的 stdout 和 stderr
 * 3. 5 分钟后强制终止 iflow（防止 Context 污染）
 * 4. 支持 Ctrl+C 优雅退出
 */

import { spawn } from 'child_process';

const TIME_LIMIT = 5 * 60 * 1000; // 5 分钟
const SLEEP_BETWEEN = 2000; // 2 秒

/**
 * 运行单个 iflow 会话
 */
async function runIflowSession(): Promise<void> {
  const startTime = Date.now();
  console.log('Starting iflow session...\n');

  const iflowProcess = spawn('iflow', ['-y'], {
    stdio: ['inherit', 'pipe', 'pipe'],
  });

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
