# 规格说明：Ralph 外层把控者集成

## 背景与目标

### 背景

**NanoSpec 现状：**
- 基于 Spec-Driven 的工作流（规格 → 方案 → 执行 → 验收）
- 每个任务独立创建、管理和完成
- 支持多个 AI 工具（Cursor、Qwen、iFlow、Cline 等）
- 具备任务切换和断点续执行能力

**Ralph 核心理念：**
- 自动化循环执行机制（无人值守持续开发）
- 宏观目标驱动的任务分解和执行
- 自主学习和模式提取（Codebase Patterns）
- 最终一致性思维（通过循环修正达到目标）

### 目标

将 Ralph 设计为 NanoSpec 的**外层把控者**，能够：

1. **接收宏观目标** - 用户提供高层级的目标或需求
2. **自主分解任务** - Ralph 分析目标，创建多个子任务
3. **自动执行流程** - 对每个子任务执行完整的 NanoSpec 工作流
4. **持续跟踪进度** - 记录详细的学习点和可重用模式
5. **循环直到完成** - 不断迭代直到所有宏观目标达成

**核心价值主张：**
- 用户只需给出方向，Ralph 负责实现细节
- 自动化的多任务管理和执行
- 知识沉淀和模式复用
- 无需人工干预的持续开发能力

## 核心组成

### 1. 架构概览

```
┌─────────────────────────────────────────────────────────────────┐
│                   Ralph 外层把控者架构（简化版）                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  用户层面:                                                       │
│    ┌──────────────┐                                             │
│    │ prd.json     │  (核心状态对象，由内层 AI 管理)            │
│    └──────────────┘                                             │
│           ↓                                                     │
│                                                                 │
│  Ralph 控制层 (scripts/ralph.ts):                                │
│    ┌────────────────────────────────────────────────────────┐   │
│    │  [循环开始]                                              │   │
│    │      ↓                                                  │   │
│    │  调用 iflow                                              │   │
│    │      ↓                                                  │   │
│    │  检测 <promise>COMPLETE</promise>                        │   │
│    │      ↓                                                  │   │
│    │  [完成?] ──────否──→ 继续循环                             │   │
│    │        │                                                 │   │
│    │       是 ↓                                                │   │
│    │  [循环结束]                                              │   │
│    └────────────────────────────────────────────────────────┘   │
│                                                                 │
│  内层 AI (iflow) - 由 Ralph 脚本循环调用:                        │
│    • 读取 prd.json 获取当前任务状态                             │
│    • 根据需要创建任务 (nanospec new)                            │
│    • 切换任务 (nanospec switch)                                 │
│    • 执行 NanoSpec 流程 (1-spec → 2-plan → 3-execute)          │
│    • 更新 prd.json (phase / progress_note)                     │
│    • 检测完成，输出 <promise>COMPLETE</promise>                 │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**核心职责分工：**
- **Ralph 脚本**：循环调用 iflow、检测完成标志、记录日志
- **内层 AI**：任务创建、任务切换、NanoSpec 流程执行、prd.json 更新

### 2. 目录结构

```
project-root/
├── .nanospec/
│   ├── config.json              # 项目配置
│   └── .current                 # 当前任务指针（由内层 AI 管理）
│
├── scripts/
│   └── ralph.ts                 # Ralph 外层控制器脚本（TypeScript）
│
├── nanospec/
│   ├── ralph/
│   │   ├── prd.json             # 核心状态对象（任务队列 + 状态）
│   │   └── progress.txt         # 进度日志（可选）
│   │
│   ├── <task-a>/                # 内层 AI 创建的子任务 A
│   │   ├── brief.md
│   │   ├── alignment.md
│   │   └── outputs/
│   │       ├── 1-spec.md
│   │       ├── 2-plan.md
│   │       ├── 3-tasks.md
│   │       └── summary.md
│   │
│   ├── <task-b>/                # 内层 AI 创建的子任务 B
│   └── <task-c>/                # 内层 AI 创建的子任务 C
│
└── ... (项目代码)
```

### 3. 核心组件

#### 3.1 prd.json - 核心状态对象

**作用**：内层 AI 的工作记忆，包含任务队列、当前焦点、phase 细分状态、progress_note。

**结构：**
```json
{
  "project": "MySuperApp",
  "version": "1.0.0",
  "last_updated": "2023-10-27 10:00:00",
  "ralph_instruction": "当前上下文已重置。请检查 active_task_id 并从那里继续。",
  "tasks": [
    {
      "id": "T-1",
      "title": "设计用户鉴权系统",
      "status": "completed",
      "nanospec_file": "specs/auth.nano"
    },
    {
      "id": "T-2",
      "title": "实现登录接口",
      "status": "in_progress",
      "nanospec_file": "specs/login.nano",
      "phase": "execute",
      "progress_note": "Plan 已生成，测试用例写了一半，上次中断在 test_login_fail.ts"
    },
    {
      "id": "T-3",
      "title": "前端登录页",
      "status": "pending"
    }
  ]
}
```

**关键字段说明：**
- `project` - 项目名称
- `version` - 项目版本
- `last_updated` - 最后更新时间
- `ralph_instruction` - AI 重启时的上下文注入信息
- `tasks` - 任务队列数组
  - `id` - 任务唯一标识
  - `title` - 任务标题
  - `status` - 任务状态（pending / in_progress / completed）
  - `nanospec_file` - 关联的 nanospec 任务目录路径
  - `phase` - 当前阶段（spec / plan / execute / review）
  - `progress_note` - 进度备注（用于断点续执行）

**更新规则（由内层 AI 负责）：**
- AI 每完成一个原子操作必须立即更新 `phase` 和 `progress_note`
- AI 可以添加新任务或拆分现有任务
- AI 完成所有任务后，输出 `<promise>COMPLETE</promise>` 标志

#### 3.2 Ralph 脚本（scripts/ralph.ts）

**作用**：外层循环控制器，负责循环调用 iflow、检测完成标志。

**核心功能：**
1. 循环调用 iflow
2. 检测 `<promise>COMPLETE</promise>` 标志
3. 到达最大迭代次数后退出
4. 进度日志记录（可选）

**核心逻辑：**
```typescript
import { spawn } from 'child_process';

async function main() {
  const TIME_LIMIT = 5 * 60 * 1000; // 5 分钟
  const SLEEP_BETWEEN = 2000; // 2 秒

  console.log('Ralph started. Press Ctrl+C to stop.');

  while (true) {
    console.log('\n==============================================================');
    console.log('  Starting iflow session...');
    console.log('==============================================================');

    const startTime = Date.now();
    const iflowProcess = spawn('iflow', ['-y']);

    // 监控 iflow 输出
    iflowProcess.stdout.on('data', (data) => {
      console.log(data.toString());
    });

    iflowProcess.stderr.on('data', (data) => {
      console.error(data.toString());
    });

    // 超时终止
    const timeoutId = setTimeout(() => {
      if (!iflowProcess.killed) {
        console.log('\n⏰ Time limit reached, killing iflow...');
        iflowProcess.kill();
      }
    }, TIME_LIMIT);

    // 等待进程结束
    await new Promise<void>((resolve) => {
      iflowProcess.on('close', () => {
        clearTimeout(timeoutId);
        resolve();
      });
    });

    const elapsed = Date.now() - startTime;
    console.log(`\nSession ended (elapsed: ${elapsed / 1000}s).`);

    console.log('Sleeping before next session...');
    await sleep(SLEEP_BETWEEN);
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

main();
```

**使用方式：**
```bash
# 使用 tsx 直接运行
npx tsx scripts/ralph.ts

# 或先编译再运行
npm run build
node dist/ralph.js
```

**内层 AI 的职责（由 Ralph 脚本循环调用）：**

内层 AI 运行在 iflow 环境中，需要使用 iflow 的 slash commands 来执行 NanoSpec 流程。

**Slash Commands 位置：**
- `.iflow/commands/spec.1-spec.toml` - 规格撰写命令
- `.iflow/commands/spec.2-plan.toml` - 方案设计命令
- `.iflow/commands/spec.3-execute.toml` - 执行交付命令

**内层 AI 工作流程：**
1. 读取 prd.json 获取当前任务状态
2. 根据需要创建任务 (nanospec new)
3. 切换任务 (nanospec switch)
4. 执行 NanoSpec 流程：
   - 使用 iflow 的 slash command `/spec.1-spec` 执行规格撰写
   - 使用 iflow 的 slash command `/spec.2-plan` 执行方案设计
   - 使用 iflow 的 slash command `/spec.3-execute` 执行交付
5. 更新 prd.json (phase / progress_note)
6. 完成所有任务后，等待用户手动停止 Ralph 脚本（Ctrl+C）

### 4. Ralph 工作流程

#### 阶段 1: Ralph 脚本循环

```
while (true) {
    1. 启动 iflow -y
    2. 实时输出 iflow 的 stdout 和 stderr
    3. 5 分钟后强制终止 iflow（防止 Context 污染）
    4. 等待 iflow 进程结束
    5. 休眠 2 秒
    6. 继续下一次循环（直到用户手动 Ctrl+C 停止）
}
```

**核心机制：**
- 时间限制：每次 iflow 会话最多运行 5 分钟
- 持续循环：无限循环，直到用户手动停止
- 自动重置：每次循环都是全新的 iflow 会话，Context 重置

#### 阶段 2: 内层 AI 执行流程（每次 iflow 调用）

```
1. 启动时读取 prd.json
2. 定位当前 in_progress 任务
3. 如果没有 nanospec_file，执行 nanospec new，更新 prd.json
4. 根据 phase 状态决定执行步骤：
   - phase="spec": 执行 /spec.1-spec，完成后更新 phase="plan"
   - phase="plan": 执行 /spec.2-plan，完成后更新 phase="execute"
   - phase="execute": 执行 /spec.3-execute，完成后更新 phase="review"
   - phase="review": 运行质量检查，完成后更新 status="completed"
5. 每完成一步立即更新 prd.json 的 phase 和 progress_note
6. 如果发现任务需要拆分，直接修改 prd.json 添加新任务
7. 如果当前会话被 Kill（5 分钟到），下次 iflow 调用时从 progress_note 恢复
```

**核心机制：**
- Checkpoint 机制：每完成一步立即更新 prd.json
- 断点续执行：被 Kill 后可以从 progress_note 恢复
- 无状态执行：每次会话独立，依赖 prd.json 恢复状态

### 5. 使用方式

#### 5.1 Ralph 脚本

**运行脚本：**
```bash
# 使用 tsx 直接运行
npx tsx scripts/ralph.ts

# 或先编译再运行
npm run build
node dist/ralph.js
```

**脚本参数（通过环境变量）：**
- `RALPH_MAX_ITERATIONS` - 最大迭代次数，默认 50

**示例：**
```bash
# 最大迭代 20 次
RALPH_MAX_ITERATIONS=20 npx tsx scripts/ralph.ts
```

#### 5.2 斜杠命令（AI 工具内使用）

| 命令 | 说明 |
|------|------|
| `/spec.ralph-status` | 查看当前任务状态（从 prd.json 读取） |
| `/spec.ralph-add` | 添加新任务到 prd.json |
| `/spec.ralph-sync` | 同步 prd.json 状态 |
| `/spec.ralph-complete` | 标记当前任务为完成 |

### 6. 配置扩展

**新增配置项：**
```json
{
  "ralph": {
    "enabled": true,
    "prd_file": "nanospec/ralph/prd.json",
    "runner_script": "scripts/ralph.ts",
    "max_iterations": 50,
    "sleep_between_iterations": 2000,
    "quality_checks": {
      "typecheck": "npm run typecheck || tsc --noEmit",
      "lint": "npm run lint || eslint .",
      "test": "npm test",
      "build": "npm run build"
    }
  }
}
```

## 成功标志

### 1. 功能完整性

- Ralph 脚本能够循环调用 iflow
- Ralph 脚本能够在 5 分钟后强制终止 iflow
- 内层 AI 能够读取和更新 prd.json
- 内层 AI 能够创建任务 (nanospec new)
- 内层 AI 能够切换任务 (nanospec switch)
- 内层 AI 能够执行完整的 NanoSpec 流程
- 内层 AI 可以从 prd.json 的 progress_note 恢复工作

### 2. 兼容性

- 现有的 NanoSpec 工作流完全不受影响
- Ralph 是可选功能，可独立启用
- 支持与现有的任务指针机制协同工作
- 支持与现有的预设包系统协同工作

### 3. 可维护性

- prd.json 结构清晰，易于理解和扩展
- Ralph 脚本代码简洁，易于维护
- 配置项有合理的默认值
- 错误处理完善，有清晰的错误提示
- 有完整的测试覆盖

### 4. 可中断和恢复

- 内层 AI 会话可以随时被 Ralph 脚本终止（5 分钟超时）
- 内层 AI 可以从 prd.json 的 progress_note 恢复工作
- 状态持久化到 prd.json，不丢失进度
- 支持 phase 级别的断点续执行
- 用户可以随时通过 Ctrl+C 停止 Ralph 脚本

### 5. 性能

- 每次会话有时间限制（5 分钟），防止无限运行
- 内层 AI 能够在有限时间内产出到 prd.json（checkpoint）
- prd.json 的更新不影响执行速度
- 脚本循环不会造成资源泄漏
- 进程被正确终止，不会留下僵尸进程

## 约束与注意

### 风格/规范

- 代码风格与现有 NanoSpec 代码保持一致
- 使用 TypeScript 严格模式
- 遵循现有的测试模式（使用 Vitest）

### 依赖项

- 不引入新的运行时依赖（仅使用现有依赖）
- 配置文件支持 JSON 和 JavaScript 格式
- 兼容 Node.js >= 18

### 兼容性要求

- 支持 iflow AI 工具
- 不破坏现有的任务创建和切换机制
- 保持与现有预设包系统的兼容性

### 安全性

- Ralph 脚本启动前需要用户确认
- 自动提交功能默认关闭，需显式启用
- 质量检查失败时立即停止当前任务

### 性能考虑

- 每次会话有时间限制（5 分钟），防止 Context 污染
- 进度日志追加模式，避免文件过大
- 进程正确终止，不会留下僵尸进程

### 用户体验

- Ralph 是可选功能，不影响现有用户
- 有清晰的进度指示
- 循环执行可随时中断（Ctrl+C）
- 错误信息友好且可操作