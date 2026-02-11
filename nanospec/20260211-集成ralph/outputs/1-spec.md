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
├── nanospec/
│   ├── ralph/
│   │   ├── goals.md             # 宏观目标描述
│   │   ├── prd.json             # 结构化目标定义（可选）
│   │   ├── progress.txt         # Ralph 进度日志
│   │   ├── ralph-state.json     # 状态快照
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

#### 3.1 goals.md - 宏观目标描述

**结构示例：**
```markdown
# 宏观目标：[项目/功能名称]

## 目标概述
描述整体目标和成功标准

## 核心要求
- 要求 1
- 要求 2
- 要求 3

## 约束条件
- 技术约束
- 时间约束
- 资源约束

## 成功标准
- [ ] 标准 1
- [ ] 标准 2
- [ ] 标准 3

## 上下文信息
- 相关文档
- 参考资料
- 现有系统状态
```

#### 3.2 prd.json - 结构化目标定义（可选）

**结构：**
```json
{
  "projectName": "项目名称",
  "branchName": "ralph/project-name",
  "goals": [
    {
      "id": "goal-1",
      "title": "目标标题",
      "description": "详细描述",
      "priority": 1,
      "status": "pending",
      "acceptanceCriteria": [
        "验收标准 1",
        "验收标准 2"
      ]
    }
  ],
  "constraints": {
    "maxIterations": 50,
    "qualityChecks": {
      "typecheck": true,
      "lint": true,
      "test": true
    },
    "autoCommit": false
  }
}
```

#### 3.3 progress.txt - 进度日志

**结构：**
```
## Codebase Patterns
- 可重用模式 1
- 可重用模式 2

## Ralph Session Log
开始时间: 2026-02-11 10:00:00
宏观目标: [项目名称]

---

## 2026-02-11 10:05:00 - 任务创建
- 创建任务: task-a (用户登录功能)
- 任务描述: 实现基本的用户登录和注册流程
- 预期产出: 完整的登录表单、API 接口、测试用例

---

## 2026-02-11 10:45:00 - 任务完成
- 完成任务: task-a
- 修改文件: src/auth/login.ts, src/auth/register.ts
- 测试结果: 通过 (12/12)
- **学习点:**
  - 认证流程使用 JWT token
  - 密码加密使用 bcrypt
  - API 错误处理统一格式

---

## 2026-02-11 11:00:00 - 任务创建
- 创建任务: task-b (用户权限管理)
- 依赖: task-a
```

#### 3.4 ralph-state.json - 状态快照

**结构：**
```json
{
  "session": {
    "id": "session-20260211-100000",
    "startTime": "2026-02-11T10:00:00Z",
    "status": "running",
    "iteration": 3
  },
  "goals": {
    "total": 5,
    "completed": 1,
    "pending": 4
  },
  "currentTask": "task-b",
  "completedTasks": ["task-a"],
  "pendingTasks": ["task-b", "task-c", "task-d", "task-e"],
  "patterns": [
    "认证流程使用 JWT token",
    "密码加密使用 bcrypt"
  ]
}
```

### 4. Ralph 工作流程

#### 阶段 1: 初始化
1. 读取 goals.md 或 prd.json
2. 分析目标，识别核心需求
3. 初始化 progress.txt
4. 创建 ralph-state.json

#### 阶段 2: 任务分解
1. 分析宏观目标的结构和依赖关系
2. 分解为可执行的子任务
3. 确定任务优先级和执行顺序
4. 记录到状态文件

#### 阶段 3: 循环执行
对每个子任务：
1. 检查任务状态（已完成/进行中/待开始）
2. 创建任务目录（`nanospec new`）
3. 切换到该任务（`nanospec switch`）
4. 执行完整 NanoSpec 流程：
   - `/spec.1-spec` - 撰写规格
   - `/spec.2-plan` - 制定方案
   - `/spec.3-execute` - 执行交付
   - `/spec.accept` - 验收（可选）
5. 运行质量检查
6. 提取可重用模式
7. 更新 progress.txt
8. 提交更改（可选）
9. 归档任务（可选）

#### 阶段 4: 完成检查
1. 检查所有目标是否完成
2. 验证整体成功标准
3. 生成最终总结
4. 更新 ralph-state.json

### 5. 命令扩展

#### 5.1 新增 CLI 命令

| 命令 | 说明 | 参数 |
|------|------|------|
| `nanospec ralph start` | 启动 Ralph 控制循环 | `--max-iterations`, `--goals-file` |
| `nanospec ralph stop` | 停止当前 Ralph 会话 | 无 |
| `nanospec ralph status` | 查看 Ralph 会话状态 | 无 |
| `nanospec ralph resume` | 恢复中断的会话 | 无 |
| `nanospec ralph summary` | 生成会话总结 | 无 |

#### 5.2 新增斜杠命令

| 命令 | 说明 |
|------|------|
| `/spec.ralph-start` | 在 AI 工具中启动 Ralph |
| `/spec.ralph-decompose` | 手动触发任务分解 |
| `/spec.ralph-next` | 处理下一个任务 |
| `/spec.ralph-status` | 查看当前状态 |

### 6. 配置扩展

**新增配置项：**
```json
{
  "ralph": {
    "enabled": true,
    "goals_file": "nanospec/ralph/goals.md",
    "max_iterations": 50,
    "auto_commit": false,
    "archive_completed": true,
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
    "pattern_extraction": {
      "enabled": true,
      "update_agents_md": true
    }
  }
}
```

## 成功标志

### 1. 功能完整性

- Ralph 能够读取并理解宏观目标
- 能够自主分解目标为多个可执行的子任务
- 能够对每个子任务执行完整的 NanoSpec 流程
- progress.txt 能够正确记录详细的迭代日志
- ralph-state.json 能够准确反映当前状态
- 可重用模式能够被正确提取和记录

### 2. 兼容性

- 现有的 NanoSpec 工作流完全不受影响
- Ralph 是可选功能，可独立启用
- 支持与现有的任务指针机制协同工作
- 支持与现有的预设包系统协同工作

### 3. 可维护性

- 代码结构清晰，易于扩展
- 配置项有合理的默认值
- 错误处理完善，有清晰的错误提示
- 有完整的测试覆盖

### 4. 可中断和恢复

- Ralph 会话可以随时中断
- 可以从中断点恢复继续执行
- 状态持久化，不丢失进度

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