# 方案：Ralph 外层把控者集成

## 方案概述

本方案将 Ralph 设计为 NanoSpec 的外层把控者，通过 TypeScript 脚本循环调用 iflow，实现无人值守的持续开发能力。核心架构包括：

1. **Ralph 脚本** (`scripts/ralph.ts`) - 外层循环控制器
2. **prd.json** - 内层 AI 的核心状态对象
3. **斜杠命令** - prd 状态管理命令
4. **配置扩展** - ralph 相关配置项

## 详细执行方案

### 1. 核心数据模型设计

#### 1.1 prd.json TypeScript 接口

创建 `src/ralph/types.ts` 定义数据结构：

```typescript
export type TaskStatus = 'pending' | 'in_progress' | 'completed';
export type TaskPhase = 'spec' | 'plan' | 'execute' | 'review';

export interface PrdTask {
  id: string;
  title: string;
  status: TaskStatus;
  nanospec_file?: string;
  phase?: TaskPhase;
  progress_note?: string;
}

export interface PrdJson {
  project: string;
  version: string;
  last_updated: string;
  ralph_instruction: string;
  tasks: PrdTask[];
}
```

#### 1.2 prd.json 读写工具函数

创建 `src/ralph/prd.ts` 提供工具函数：

```typescript
import * as fs from 'fs/promises';
import * as path from 'path';
import type { PrdJson, PrdTask } from './types.js';

export async function readPrd(prdPath: string): Promise<PrdJson> {
  const content = await fs.readFile(prdPath, 'utf-8');
  return JSON.parse(content);
}

export async function writePrd(prdPath: string, prd: PrdJson): Promise<void> {
  prd.last_updated = new Date().toISOString();
  await fs.writeFile(prdPath, JSON.stringify(prd, null, 2), 'utf-8');
}

export function getActiveTask(prd: PrdJson): PrdTask | undefined {
  return prd.tasks.find(t => t.status === 'in_progress');
}

export function getPendingTask(prd: PrdJson): PrdTask | undefined {
  return prd.tasks.find(t => t.status === 'pending');
}
```

### 2. Ralph 脚本实现

#### 2.1 脚本结构

创建 `scripts/ralph.ts`，核心功能：

```typescript
import { spawn } from 'child_process';
import * as path from 'path';

const TIME_LIMIT = 5 * 60 * 1000; // 5 分钟
const SLEEP_BETWEEN = 2000; // 2 秒

async function main() {
  console.log('Ralph started. Press Ctrl+C to stop.');
  console.log(`Time limit per session: ${TIME_LIMIT / 1000}s`);
  console.log(`Sleep between sessions: ${SLEEP_BETWEEN / 1000}s\n`);

  let iteration = 0;

  while (true) {
    iteration++;
    console.log('='.repeat(64));
    console.log(`  Iteration ${iteration}`);
    console.log('='.repeat(64));

    await runIflowSession();
    console.log('Sleeping before next session...\n');

    await sleep(SLEEP_BETWEEN);
  }
}

async function runIflowSession(): Promise<void> {
  const startTime = Date.now();
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

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// 优雅退出
process.on('SIGINT', () => {
  console.log('\n\n👋 Ralph stopped by user.');
  process.exit(0);
});

main();
```

#### 2.2 编译和运行

Ralph 脚本需要编译后才能使用，使用 tsx 可以直接运行 TypeScript 文件。

### 3. 配置扩展

#### 3.1 更新 config.json

在 `.nanospec/config.json` 中添加 ralph 配置项：

```json
{
  "ralph": {
    "enabled": false,
    "prd_file": "nanospec/ralph/prd.json",
    "runner_script": "scripts/ralph.ts",
    "time_limit": 300000,
    "sleep_between": 2000
  }
}
```

#### 3.2 配置类型定义

在 `src/config/config.ts` 中添加 ralph 配置类型：

```typescript
export interface RalphConfig {
  enabled: boolean;
  prd_file: string;
  runner_script: string;
  time_limit: number;
  sleep_between: number;
}

export interface Config {
  // ... 现有配置
  ralph?: RalphConfig;
}
```

### 4. 测试策略

#### 5.1 单元测试

- `src/ralph/types.test.ts` - 类型定义测试
- `src/ralph/prd.test.ts` - prd 读写测试

#### 5.2 集成测试

创建 `test-ralph/` 子文件夹进行端到端测试：

1. 初始化 nanospec 项目
2. 创建测试任务
3. 运行 ralph.ts 脚本
4. 验证任务完成情况

### 5. 集成点

#### 5.1 与现有命令集成

Ralph 功能与现有命令的交互：

- `nanospec new` - 内层 AI 创建新任务
- `nanospec switch` - 内层 AI 切换当前任务
- `nanospec status` - 查看当前状态

#### 5.2 与预设包系统集成

Ralph 不影响现有预设包系统，可以独立启用或禁用。

### 6. 错误处理

#### 6.1 Ralph 脚本错误处理

- iflow 进程启动失败：记录错误并继续下一次循环
- 超时终止：使用 SIGTERM 优雅终止，必要时使用 SIGKILL
- 用户中断：捕获 SIGINT 信号，优雅退出

#### 6.2 prd.json 错误处理

- prd.json 不存在：提示用户初始化
- prd.json 格式错误：记录错误并提示修复
- 读写失败：记录错误并继续

### 7. 性能优化

#### 7.1 资源管理

- 确保进程被正确终止，避免僵尸进程
- 及时清理定时器，避免内存泄漏
- 限制单次会话时间，防止资源占用

#### 7.2 进度日志

- 使用追加模式写入 progress.txt，避免文件过大
- 定期清理旧的日志文件

### 8. 安全性

#### 8.1 用户确认

- Ralph 脚本启动前需要用户确认
- 不自动提交代码，需要显式启用

#### 8.2 质量检查

- 质量检查失败时立即停止当前任务
- 确保代码通过类型检查、lint 和测试

### 9. 用户体验

#### 9.1 进度指示

- 每次循环显示迭代次数
- 显示会话持续时间和退出码
- 清晰的日志输出

#### 9.2 可中断性

- 支持 Ctrl+C 随时停止
- 进度持久化到 prd.json，不丢失进度
- 支持断点续执行