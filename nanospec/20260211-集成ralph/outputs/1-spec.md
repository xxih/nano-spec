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
│                   Ralph 外层把控者架构                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  用户层面:                                                       │
│    ┌──────────────┐                                             │
│    │ 宏观目标描述   │  (goals.md / prd.json)                    │
│    └──────────────┘                                             │
│           ↓                                                     │
│                                                                 │
│  Ralph 控制层:                                                  │
│    ┌────────────────────────────────────────────────────────┐   │
│    │  [循环开始]                                              │   │
│    │      ↓                                                  │   │
│    │  读取宏观目标                                             │   │
│    │      ↓                                                  │   │
│    │  分析并分解任务 ───────→ 未完成任务列表                   │   │
│    │      ↓                                                  │   │
│    │  选择下一个任务 ───────→ 任务指针更新                     │   │
│    │      ↓                                                  │   │
│    │  创建任务 (nanospec new) ───────→ nanospec/子任务目录/   │   │
│    │      ↓                                                  │   │
│    │  切换任务 (nanospec switch)                              │   │
│    │      ↓                                                  │   │
│    │  执行 NanoSpec 流程:                                     │   │
│    │    • 1-spec: 规格撰写                                    │   │
│    │    • 2-plan: 方案规划                                    │   │
│    │    • 3-execute: 执行交付                                 │   │
│    │      ↓                                                  │   │
│    │  运行质量检查                                             │   │
│    │      ↓                                                  │   │
│    │  提取可重用模式 ───────→ progress.txt / AGENTS.md        │   │
│    │      ↓                                                  │   │
│    │  记录进度日志 ───────→ progress.txt                      │   │
│    │      ↓                                                  │   │
│    │  提交更改（可选）                                         │   │
│    │      ↓                                                  │   │
│    │  [所有目标完成?] ──────否──→ 继续循环                     │   │
│    │        │                                                 │   │
│    │       是 ↓                                                │   │
│    │  [循环结束]                                              │   │
│    └────────────────────────────────────────────────────────┘   │
│                                                                 │
│  NanoSpec 任务层面 (多个并发或串行):                             │
│    ┌────────────────┐  ┌────────────────┐  ┌────────────────┐ │
│    │ 子任务 A:       │  │ 子任务 B:       │  │ 子任务 C:       │ │
│    │ - brief.md     │  │ - brief.md     │  │ - brief.md     │ │
│    │ - 1-spec.md   │  │ - 1-spec.md   │  │ - 1-spec.md   │ │
│    │ - 2-plan.md   │  │ - 2-plan.md   │  │ - 2-plan.md   │ │
│    │ - 3-tasks.md  │  │ - 3-tasks.md  │  │ - 3-tasks.md  │ │
│    │ - summary.md  │  │ - summary.md  │  │ - summary.md  │ │
│    └────────────────┘  └────────────────┘  └────────────────┘ │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 2. 目录结构

```
project-root/
├── .nanospec/
│   ├── config.json              # 项目配置
│   └── .current                 # 当前任务指针（被 Ralph 管理）
│
├── scripts/
│   └── ralph.ts                 # Ralph 外层控制器脚本（TypeScript）
│
├── nanospec/
│   ├── ralph/
│   │   ├── prd.json             # 核心状态对象（任务队列 + 状态）
│   │   ├── prompt.md            # amp 工具的 prompt 模板
│   │   ├── CLAUDE.md            # Claude 工具的 prompt 模板
│   │   ├── IFLOW.md             # iFlow 工具的 prompt 模板
│   │   ├── progress.txt         # 进度日志
│   │   ├── .last-branch         # 上次分支记录
│   │   └── archive/             # 完成任务的归档
│   │       ├── 20260211-task-a/
│   │       └── 20260211-task-b/
│   │
│   ├── <task-a>/                # Ralph 创建的子任务 A
│   │   ├── brief.md
│   │   ├── alignment.md
│   │   └── outputs/
│   │       ├── 1-spec.md
│   │       ├── 2-plan.md
│   │       ├── 3-tasks.md
│   │       └── summary.md
│   │
│   ├── <task-b>/                # Ralph 创建的子任务 B
│   └── <task-c>/                # Ralph 创建的子任务 C
│
└── ... (项目代码)
```

### 3. 核心组件

#### 3.1 prd.json - 核心状态对象

**作用**：Ralph 和 AI 之间的共享内存，包含任务队列、当前焦点、phase 细分状态、progress_note。

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

**更新规则：**
- AI 每完成一个原子操作必须立即更新 `phase` 和 `progress_note`
- AI 可以添加新任务或拆分现有任务
- Ralph 定期检查 `prd.json` 的更新时间，判断 AI 是否僵死

#### 3.2 AI 系统提示（Ralph-Aware Skill）

**作用**：让 AI 感知无状态执行环境，支持 checkpoint 机制和任务扩展。

**系统提示内容：**
```
Role: 你是 Ralph 自动化流水线中的 Worker。

Environment: 你的上下文内存是有限的，外部脚本（Ralph）会在你运行一段时间后强制杀死你（Kill）。

Primary Rule: Stateless Execution (无状态执行)。

Workflow:
1. 启动 (On Boot): 立即读取根目录下的 prd.json。
2. 定位 (Locate): 找到状态为 in_progress 的任务。
3. 如果没有 nanospec_file，创建它 (nanospec new)，并立即更新 prd.json。
4. 执行 (Execute): 根据 nanospec 的标准流程 (Spec -> Plan -> Code) 工作。
5. 同步 (Sync): 每当你完成一个原子操作（如写完一个 Spec，或通过一个 Test），必须更新 prd.json 中的 progress_note 和 phase。这是你的"存档点"。
6. 扩展 (Expand): 如果你发现当前任务需要拆分，请直接修改 prd.json，将任务拆分或添加新任务。
```

**实现方式：**
- 在 `nanospec switch` 时自动注入系统提示
- 在 `/spec.*` 命令中携带系统提示上下文
- 在 prd.json 中通过 `ralph_instruction` 字段传递

#### 3.3 外层控制器（scripts/ralph.ts）

**作用**：外层监控者，负责循环启动 AI、监控执行状态、强制 Kill 重置上下文。

**核心功能（基于 ralph.ps1）：**
1. 多 AI 工具支持（amp/claude/iflow）
2. Prompt 文件读取（prompt.md/CLAUDE.md/IFLOW.md）
3. PRD 文件管理（读取 branchName，检测变更）
4. 进度日志（读取/写入 progress.txt）
5. 分支变更归档（检测分支变化，复制到 archive/）
6. 分支跟踪（记录 .last-branch 文件）
7. 循环控制（最大迭代次数，检测 `<promise>COMPLETE</promise>`）
8. AI 工具调用（child_process，捕获输出）
9. UTF-8 编码（Node.js 默认支持）

**核心逻辑：**
```typescript
import * as fs from 'fs';
import * as path from 'path';
import { exec } from 'child_process';

interface Task {
  id: string;
  title: string;
  status: 'pending' | 'in_progress' | 'completed';
  nanospec_file?: string;
  phase?: 'spec' | 'plan' | 'execute' | 'review';
  progress_note?: string;
}

interface Prd {
  project: string;
  version: string;
  last_updated: string;
  branchName?: string;
  ralph_instruction: string;
  tasks: Task[];
}

async function main() {
  const scriptDir = path.dirname(__filename);
  const prdFile = path.join(scriptDir, '../nanospec/ralph/prd.json');
  const progressFile = path.join(scriptDir, '../nanospec/ralph/progress.txt');
  const archiveDir = path.join(scriptDir, '../nanospec/ralph/archive');
  const lastBranchFile = path.join(scriptDir, '../nanospec/ralph/.last-branch');

  // 分支变更归档
  if (fs.existsSync(prdFile) && fs.existsSync(lastBranchFile)) {
    const prd = JSON.parse(fs.readFileSync(prdFile, 'utf-8')) as Prd;
    const lastBranch = fs.readFileSync(lastBranchFile, 'utf-8').trim();

    if (prd.branchName && lastBranch && prd.branchName !== lastBranch) {
      const date = new Date().toISOString().split('T')[0];
      const folderName = lastBranch.replace('ralph/', '');
      const archiveFolder = path.join(archiveDir, `${date}-${folderName}`);

      fs.mkdirSync(archiveFolder, { recursive: true });
      fs.copyFileSync(prdFile, path.join(archiveFolder, 'prd.json'));
      if (fs.existsSync(progressFile)) {
        fs.copyFileSync(progressFile, path.join(archiveFolder, 'progress.txt'));
      }

      fs.writeFileSync(progressFile, `# Ralph Progress Log\nStarted: ${new Date()}\n---\n`);
    }
  }

  // 记录当前分支
  if (fs.existsSync(prdFile)) {
    const prd = JSON.parse(fs.readFileSync(prdFile, 'utf-8')) as Prd;
    if (prd.branchName) {
      fs.writeFileSync(lastBranchFile, prd.branchName);
    }
  }

  // 初始化进度文件
  if (!fs.existsSync(progressFile)) {
    fs.writeFileSync(progressFile, `# Ralph Progress Log\nStarted: ${new Date()}\n---\n`);
  }

  const maxIterations = 50;
  const tool = 'iflow';

  for (let i = 1; i <= maxIterations; i++) {
    console.log(`\n==============================================================`);
    console.log(`  Ralph Iteration ${i} of ${maxIterations} (${tool})`);
    console.log(`==============================================================`);

    const promptFile = path.join(scriptDir, '../nanospec/ralph/IFLOW.md');
    const prompt = fs.readFileSync(promptFile, 'utf-8');

    try {
      const output = await execPromise(`${tool} -y`, { input: prompt });

      if (output.includes('<promise>COMPLETE</promise>')) {
        console.log('\nRalph completed all tasks!');
        process.exit(0);
      }
    } catch (error) {
      console.error('Error running tool:', error);
    }

    console.log(`Iteration ${i} complete. Continuing...`);
    await sleep(2000);
  }

  console.log(`\nRalph reached max iterations (${maxIterations}) without completing all tasks.`);
  console.log(`Check ${progressFile} for status.`);
}

function execPromise(command: string, options: { input?: string }): Promise<string> {
  return new Promise((resolve, reject) => {
    exec(command, options, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      } else {
        resolve(stdout + stderr);
      }
    });
  });
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

main();
```

**使用方式：**
```bash
# 编译并运行
npx tsx scripts/ralph.ts

# 或先编译再运行
npm run build
node dist/ralph.js
```

**Kill 策略：**
- 基于迭代次数（默认 50 次）
- 检测 `<promise>COMPLETE</promise>` 标志提前退出
- （未来可扩展）基于 prd.json 更新时间
- （未来可扩展）基于输出模式检测

#### 3.4 归档目录（archive/）

**作用**：存储已完成的子任务，保持工作目录整洁。

**结构：**
```
archive/
├── 20260211-task-a/
│   ├── brief.md
│   ├── alignment.md
│   └── outputs/
│       ├── 1-spec.md
│       ├── 2-plan.md
│       ├── 3-tasks.md
│       └── summary.md
└── 20260211-task-b/
```

### 4. Ralph 工作流程

#### 阶段 1: 初始化
1. 读取或创建 `prd.json`
2. 初始化任务队列（从用户输入或现有配置）
3. 设置第一个任务为 `in_progress`

#### 阶段 2: 任务分解（可选）
1. Ralph 分析宏观目标的结构和依赖关系
2. 将大任务分解为可执行的子任务
3. 直接修改 `prd.json`，添加新的任务条目
4. 确定任务优先级和执行顺序

#### 阶段 3: 外层控制器循环
```
while True:
    1. 读取 prd.json
    2. 找到第一个 status="in_progress" 的任务
    3. 如果没有，找到第一个 status="pending" 的任务并设置为 in_progress
    4. 如果没有任务，退出循环
    5. 构造上下文注入信息
    6. 启动 AI（iflow + 系统提示）
    7. 监控 AI 执行
    8. 到达 Kill 条件后终止 AI
    9. 休眠一段时间
    10. 继续循环
```

#### 阶段 4: AI 执行流程（单次会话）
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
7. 被 Ralph Kill 后，下一个会话从 progress_note 恢复
```

#### 阶段 5: 完成检查
1. 检查所有任务的 status 是否为 "completed"
2. 验证整体成功标准
3. 生成最终总结
4. 归档所有已完成的子任务

### 5. 使用方式

#### 5.1 Ralph 外层控制器脚本

**运行脚本：**
```bash
# 使用 tsx 直接运行
npx tsx scripts/ralph.ts

# 或先编译再运行
npm run build
node dist/ralph.js
```

**脚本参数（通过环境变量或配置文件）：**
- `RALPH_TOOL` - AI 工具选择（amp/claude/iflow），默认 iflow
- `RALPH_MAX_ITERATIONS` - 最大迭代次数，默认 50
- `RALPH_PRD_FILE` - PRD 文件路径，默认 nanospec/ralph/prd.json

**示例：**
```bash
# 使用 amp 工具，最大迭代 20 次
RALPH_TOOL=amp RALPH_MAX_ITERATIONS=20 npx tsx scripts/ralph.ts
```

#### 5.2 辅助脚本（可选）

**初始化 Ralph 环境：**
```bash
# scripts/ralph-init.ts
npx tsx scripts/ralph-init.ts --project-name "MyProject"
```

**查看 Ralph 状态：**
```bash
# scripts/ralph-status.ts
npx tsx scripts/ralph-status.ts
```

**手动归档：**
```bash
# scripts/ralph-archive.ts
npx tsx scripts/ralph-archive.ts
```

#### 5.3 斜杠命令（AI 工具内使用）

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
    "default_tool": "iflow",
    "archive_completed": true,
    "sleep_between_iterations": 2000,
    "quality_checks": {
      "typecheck": "npm run typecheck || tsc --noEmit",
      "lint": "npm run lint || eslint .",
      "test": "npm test",
      "build": "npm run build"
    },
    "task_creation": {
      "prefix": "task",
      "auto_switch": true
    },
    "system_prompt": {
      "enabled": true,
      "template": "nanospec/ralph/system-prompt.md"
    }
  }
}
```

## 成功标志

### 1. 功能完整性

- prd.json 能够正确存储任务队列、状态、phase 和 progress_note
- Ralph 外层控制器能够读取 prd.json 并启动 AI
- AI 能够感知无状态执行环境，执行 checkpoint 机制
- AI 能够根据 phase 状态正确恢复和继续工作
- AI 能够拆分任务并更新 prd.json
- 控制器能够根据 Kill 策略正确终止 AI
- 完成的任务能够正确归档

### 2. 兼容性

- 现有的 NanoSpec 工作流完全不受影响
- Ralph 是可选功能，可独立启用
- 支持与现有的任务指针机制协同工作
- 支持与现有的预设包系统协同工作

### 3. 可维护性

- prd.json 结构清晰，易于理解和扩展
- 代码结构清晰，易于扩展
- 配置项有合理的默认值
- 错误处理完善，有清晰的错误提示
- 有完整的测试覆盖

### 4. 可中断和恢复

- AI 会话可以随时被 Ralph 终止
- AI 可以从 prd.json 的 progress_note 恢复工作
- 状态持久化到 prd.json，不丢失进度
- 支持 phase 级别的断点续执行

### 5. 性能

- Kill 策略能够有效防止 Context 污染
- AI 能够在有限时间内产出到 prd.json（checkpoint）
- prd.json 的更新不影响执行速度
- 控制器循环不会造成资源泄漏

## 约束与注意

### 风格/规范

- 代码风格与现有 NanoSpec 代码保持一致
- 使用 TypeScript 严格模式
- 遵循现有的测试模式（使用 Vitest）
- 保持 CLI 命令的一致性风格

### 依赖项

- 不引入新的运行时依赖（仅使用现有依赖）
- 配置文件支持 JSON 和 JavaScript 格式
- 兼容 Node.js >= 18

### 兼容性要求

- 支持现有的所有 AI 工具适配器
- 不破坏现有的任务创建和切换机制
- 保持与现有预设包系统的兼容性

### 安全性

- Ralph 启动前必须有用户确认
- 自动提交功能默认关闭，需显式启用
- 质量检查失败时立即停止当前任务
- 提供中断机制，用户可随时停止

### 性能考虑

- 循环执行应有最大迭代次数限制
- 进度日志追加模式，避免文件过大
- 模式提取不应影响执行速度
- 支持并行任务处理（未来扩展）

### 用户体验

- Ralph 是可选功能，不影响现有用户
- 有清晰的进度指示和状态展示
- 循环执行可随时中断
- 错误信息友好且可操作
- 提供详细的日志和总结报告