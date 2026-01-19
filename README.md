# SpecFlow CLI

[English](#english) | [中文](#中文)

---

## English

A minimal extendable Spec-Driven framework. Not just for code -- for writing, research, and anything you want to get done.

### Overview

SpecFlow CLI is a lightweight command-line tool that helps you quickly initialize a Spec-Driven Development workflow project structure. It supports multiple AI tools (Cursor, qwen, iflow, cline) and provides a standardized workflow for specification, planning, execution, and acceptance.

### Features

- **Minimal & Simple**: Only 6 slash commands, CLI focuses on initialization
- **Ready to Use**: One-command initialization with `specflow init`
- **Multi-AI Support**: Generate command files for different AI tools
- **Customizable**: Modify templates and add common documents for customization
- **TDD-Driven**: Built with test-driven development, ≥80% test coverage

### Installation

#### Global Installation

```bash
npm install -g specflow-cli
```

#### Local Development

```bash
# Clone the repository
git clone <repository-url>
cd spec-flow

# Install dependencies
npm install

# Build the project
npm run build

# Link globally for testing
npm link
```

### Quick Start

1. **Initialize SpecFlow in your project**

```bash
# Initialize with default AI tool (Cursor)
specflow init

# Initialize with specific AI tool
specflow init --ai qwen
specflow init --ai iflow
specflow init --ai cline

# Force overwrite existing files
specflow init --force
```

2. **Create a new task**

```bash
# Create a task with default name
specflow new

# Create a task with custom name
specflow new "User Authentication"
```

3. **Start the workflow**

Edit the `brief.md` file in your task directory to describe your requirements, then use the slash commands:

- `/flow.1-spec` - Write specifications
- `/flow.2-plan` - Create technical plan and task breakdown
- `/flow.3-execute` - Execute and deliver
- `/flow.accept` - Create acceptance test cases
- `/flow.align` - Align and correct deviations
- `/flow.summary` - Summarize and document

### Project Structure

After initialization, your project will have the following structure:

```
your-project/
├── specflow/
│   ├── AGENTS.md                    # General rules and guidelines
│   ├── templates/                   # Output templates
│   │   ├── 1-spec.md
│   │   ├── 2-plan.md
│   │   ├── 3-tasks.md
│   │   ├── acceptance.md
│   │   ├── alignment.md
│   │   └── summary.md
│   └── <task-name>/                 # Task directories
│       ├── brief.md                 # Requirement description
│       ├── assets/                  # Supporting materials
│       ├── alignment.md             # Alignment records (optional)
│       └── outputs/
│           ├── 1-spec.md
│           ├── 2-plan.md
│           ├── 3-tasks.md
│           ├── acceptance.md
│           └── summary-*.md
├── .cursor/commands/                # Cursor commands (if used)
│   ├── flow.1-spec.md
│   ├── flow.2-plan.md
│   ├── flow.3-execute.md
│   ├── flow.accept.md
│   ├── flow.align.md
│   └── flow.summary.md
└── ... (other project files)
```

### Local Development Guide

#### Prerequisites

- Node.js >= 18
- npm or yarn
- Git (optional, for version control)

#### Development Workflow

1. **Clone and Setup**

```bash
git clone <repository-url>
cd spec-flow
npm install
```

2. **Development Mode**

```bash
# Run in development mode with tsx
npm run dev

# Run with specific commands
npm run dev init
npm run dev new "My Task"
```

3. **Building**

```bash
# Build TypeScript to JavaScript
npm run build

# The output will be in the dist/ directory
```

4. **Testing**

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

#### Project Structure for Development

```
spec-flow/
├── src/
│   ├── index.ts                    # CLI entry point
│   ├── commands/
│   │   ├── init.ts                 # specflow init command
│   │   └── new.ts                  # specflow new command
│   ├── adapters/
│   │   ├── index.ts                # Adapter registry
│   │   ├── cursor.ts               # Cursor adapter
│   │   ├── qwen.ts                 # qwen adapter
│   │   ├── iflow.ts                # iflow adapter
│   │   └── cline.ts                # cline adapter
│   └── templates/                  # Built-in templates
│       ├── AGENTS.md
│       ├── commands/
│       │   ├── flow.1-spec.md
│       │   ├── flow.2-plan.md
│       │   ├── flow.3-execute.md
│       │   ├── flow.accept.md
│       │   ├── flow.align.md
│       │   └── flow.summary.md
│       └── outputs/
│           ├── 1-spec.md
│           ├── 2-plan.md
│           ├── 3-tasks.md
│           ├── acceptance.md
│           ├── alignment.md
│           └── summary.md
├── bin/
│   └── specflow.js                 # CLI entry point
├── package.json
├── tsconfig.json
├── vitest.config.ts
└── README.md
```

#### TDD Development Process

We follow Test-Driven Development (TDD) principles:

1. **Write a failing test** (Red)
2. **Implement the feature** (Green)
3. **Refactor the code** (Refactor)

Example:

```typescript
// src/commands/init.test.ts
import {describe, it, expect, vi} from 'vitest';
import {init} from './init.js';

describe('init command', () => {
	it('should create specflow directory structure', async () => {
		// Write test first
		const consoleSpy = vi.spyOn(console, 'log');
		await init({ai: 'cursor', force: true});
		expect(consoleSpy).toHaveBeenCalledWith('✓ 创建 specflow/AGENTS.md');
	});
});
```

#### Adding a New AI Adapter

1. Create adapter file in `src/adapters/`:

```typescript
// src/adapters/mytool.ts
import {mkdirSync, cpSync} from 'fs';
import {join} from 'path';
import type {AIAdapter} from './index.js';

export const mytoolAdapter: AIAdapter = {
	name: 'mytool',
	commandsDir: '.mytool/commands/',

	generateCommands(cwd: string, templatesDir: string): void {
		const commandsDir = join(cwd, '.mytool', 'commands');
		mkdirSync(commandsDir, {recursive: true});

		// Copy command templates
		const commands = [
			'flow.1-spec.md',
			'flow.2-plan.md'
			// ... other commands
		];

		for (const cmd of commands) {
			const src = join(templatesDir, 'commands', cmd);
			const dest = join(commandsDir, cmd);
			cpSync(src, dest);
		}
	}
};
```

2. Register the adapter in `src/adapters/index.ts`:

```typescript
import {mytoolAdapter} from './mytool.js';

const adapters: Record<string, AIAdapter> = {
	cursor: cursorAdapter,
	qwen: qwenAdapter,
	iflow: iflowAdapter,
	cline: clineAdapter,
	mytool: mytoolAdapter // Add new adapter
};
```

3. Add tests for the new adapter

4. Run tests to ensure everything works

#### Customizing Templates

You can customize the templates by modifying files in `src/templates/`:

- **AGENTS.md**: General rules and guidelines
- **commands/**: Slash command definitions
- **outputs/**: Output document templates

After modifying templates, rebuild the project:

```bash
npm run build
```

### Commands Reference

#### specflow init

Initialize SpecFlow project structure.

```bash
specflow init [options]
```

**Options:**

- `--ai <tool>`: AI tool type (default: cursor)
  - Available: cursor, qwen, iflow, cline
- `-f, --force`: Force overwrite existing files

#### specflow new

Create a new task directory.

```bash
specflow new [name]
```

**Arguments:**

- `name`: Task name (optional, default: "待命名")

### Workflow Guide

#### 1. Specification Phase

Use `/flow.1-spec` to write detailed specifications based on requirements in `brief.md` and supporting materials in `assets/`.

**Output:** `outputs/1-spec.md`

#### 2. Planning Phase

Use `/flow.2-plan` to create technical plans and task breakdowns.

**Outputs:**

- `outputs/2-plan.md` - Technical plan
- `outputs/3-tasks.md` - Task checklist

#### 3. Execution Phase

Use `/flow.3-execute` to execute tasks and deliver results.

**Action:** Update task completion status in `outputs/3-tasks.md`

#### 4. Acceptance Phase

Use `/flow.accept` to create acceptance test cases.

**Output:** `outputs/acceptance.md` (optional)

#### 5. Alignment Phase

Use `/flow.align` when conflicts, ambiguities, or deviations are discovered.

**Output:** `alignment.md` (created only when needed)

#### 6. Summary Phase

Use `/flow.summary` to summarize and document the completed work.

**Output:** `outputs/summary-<date>.md` (optional)

### Priority Rules

When processing information, the following priority is applied:

```
alignment.md > brief.md / prd.md > assets/* > current state
```

**Important:** When changes occur during any phase, propagate them to:

1. `1-spec.md`
2. `2-plan.md` / `3-tasks.md`
3. `acceptance.md` (if exists)

### Testing

Run the test suite:

```bash
# All tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

Target test coverage: ≥80%

### Building

Build the project for production:

```bash
npm run build
```

The compiled files will be in the `dist/` directory.

### Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch
3. Write tests for new features (TDD)
4. Ensure all tests pass
5. Submit a pull request

### License

MIT License

---

## 中文

一个极简且可扩展的规格驱动框架。不仅适用于代码——也适用于写作、研究和任何你想完成的事情。

### 概述

SpecFlow CLI 是一个轻量级的命令行工具，帮助你快速初始化规格驱动开发工作流的项目结构。它支持多种 AI 工具（Cursor、qwen、iflow、cline），并提供标准化的规格、规划、执行和验收工作流。

### 特性

- **极简优先**：只有 6 个斜杠命令，CLI 专注于初始化
- **即开即用**：`specflow init` 一键初始化
- **多 AI 适配**：支持生成不同 AI 工具的命令文件
- **可定制**：通过修改模板和添加公共文档实现定制
- **测试驱动**：采用 TDD 开发，测试覆盖率 ≥80%

### 安装

#### 全局安装

```bash
npm install -g specflow-cli
```

#### 本地开发

```bash
# 克隆仓库
git clone <repository-url>
cd spec-flow

# 安装依赖
npm install

# 构建项目
npm run build

# 链接到全局以便测试
npm link
```

### 快速开始

1. **在项目中初始化 SpecFlow**

```bash
# 使用默认 AI 工具（Cursor）初始化
specflow init

# 使用指定的 AI 工具初始化
specflow init --ai qwen
specflow init --ai iflow
specflow init --ai cline

# 强制覆盖已存在的文件
specflow init --force
```

2. **创建新任务**

```bash
# 创建默认名称的任务
specflow new

# 创建自定义名称的任务
specflow new "用户认证功能"
```

3. **开始工作流**

编辑任务目录中的 `brief.md` 文件描述需求，然后使用斜杠命令：

- `/flow.1-spec` - 撰写规格
- `/flow.2-plan` - 创建技术方案和任务拆解
- `/flow.3-execute` - 执行交付
- `/flow.accept` - 创建验收用例
- `/flow.align` - 对齐纠偏
- `/flow.summary` - 总结沉淀

### 项目结构

初始化后，你的项目将具有以下结构：

```
your-project/
├── specflow/
│   ├── AGENTS.md                    # 通用规则和指南
│   ├── templates/                   # 输出模板
│   │   ├── 1-spec.md
│   │   ├── 2-plan.md
│   │   ├── 3-tasks.md
│   │   ├── acceptance.md
│   │   ├── alignment.md
│   │   └── summary.md
│   └── <task-name>/                 # 任务目录
│       ├── brief.md                 # 需求描述
│       ├── assets/                  # 辅助素材
│       ├── alignment.md             # 对齐记录（可选）
│       └── outputs/
│           ├── 1-spec.md
│           ├── 2-plan.md
│           ├── 3-tasks.md
│           ├── acceptance.md
│           └── summary-*.md
├── .cursor/commands/                # Cursor 命令（如果使用）
│   ├── flow.1-spec.md
│   ├── flow.2-plan.md
│   ├── flow.3-execute.md
│   ├── flow.accept.md
│   ├── flow.align.md
│   └── flow.summary.md
└── ... (其他项目文件)
```

### 本地开发指南

#### 前置要求

- Node.js >= 18
- npm 或 yarn
- Git（可选，用于版本控制）

#### 开发工作流

1. **克隆和设置**

```bash
git clone <repository-url>
cd spec-flow
npm install
```

2. **开发模式**

```bash
# 使用 tsx 在开发模式下运行
npm run dev

# 运行特定命令
npm run dev init
npm run dev new "我的任务"
```

3. **构建**

```bash
# 将 TypeScript 编译为 JavaScript
npm run build

# 输出将在 dist/ 目录中
```

4. **测试**

```bash
# 运行所有测试
npm test

# 在监听模式下运行测试
npm run test:watch

# 生成覆盖率报告
npm run test:coverage
```

#### 开发项目结构

```
spec-flow/
├── src/
│   ├── index.ts                    # CLI 入口点
│   ├── commands/
│   │   ├── init.ts                 # specflow init 命令
│   │   └── new.ts                  # specflow new 命令
│   ├── adapters/
│   │   ├── index.ts                # 适配器注册
│   │   ├── cursor.ts               # Cursor 适配器
│   │   ├── qwen.ts                 # qwen 适配器
│   │   ├── iflow.ts                # iflow 适配器
│   │   └── cline.ts                # cline 适配器
│   └── templates/                  # 内置模板
│       ├── AGENTS.md
│       ├── commands/
│       │   ├── flow.1-spec.md
│       │   ├── flow.2-plan.md
│       │   ├── flow.3-execute.md
│       │   ├── flow.accept.md
│       │   ├── flow.align.md
│       │   └── flow.summary.md
│       └── outputs/
│           ├── 1-spec.md
│           ├── 2-plan.md
│           ├── 3-tasks.md
│           ├── acceptance.md
│           ├── alignment.md
│           └── summary.md
├── bin/
│   └── specflow.js                 # CLI 入口点
├── package.json
├── tsconfig.json
├── vitest.config.ts
└── README.md
```

#### TDD 开发流程

我们遵循测试驱动开发（TDD）原则：

1. **编写失败的测试**（红色）
2. **实现功能**（绿色）
3. **重构代码**（重构）

示例：

```typescript
// src/commands/init.test.ts
import {describe, it, expect, vi} from 'vitest';
import {init} from './init.js';

describe('init 命令', () => {
	it('应该创建 specflow 目录结构', async () => {
		// 先编写测试
		const consoleSpy = vi.spyOn(console, 'log');
		await init({ai: 'cursor', force: true});
		expect(consoleSpy).toHaveBeenCalledWith('✓ 创建 specflow/AGENTS.md');
	});
});
```

#### 添加新的 AI 适配器

1. 在 `src/adapters/` 中创建适配器文件：

```typescript
// src/adapters/mytool.ts
import {mkdirSync, cpSync} from 'fs';
import {join} from 'path';
import type {AIAdapter} from './index.js';

export const mytoolAdapter: AIAdapter = {
	name: 'mytool',
	commandsDir: '.mytool/commands/',

	generateCommands(cwd: string, templatesDir: string): void {
		const commandsDir = join(cwd, '.mytool', 'commands');
		mkdirSync(commandsDir, {recursive: true});

		// 复制命令模板
		const commands = [
			'flow.1-spec.md',
			'flow.2-plan.md'
			// ... 其他命令
		];

		for (const cmd of commands) {
			const src = join(templatesDir, 'commands', cmd);
			const dest = join(commandsDir, cmd);
			cpSync(src, dest);
		}
	}
};
```

2. 在 `src/adapters/index.ts` 中注册适配器：

```typescript
import {mytoolAdapter} from './mytool.js';

const adapters: Record<string, AIAdapter> = {
	cursor: cursorAdapter,
	qwen: qwenAdapter,
	iflow: iflowAdapter,
	cline: clineAdapter,
	mytool: mytoolAdapter // 添加新适配器
};
```

3. 为新适配器添加测试

4. 运行测试确保一切正常

#### 自定义模板

你可以通过修改 `src/templates/` 中的文件来自定义模板：

- **AGENTS.md**：通用规则和指南
- **commands/**：斜杠命令定义
- **outputs/**：输出文档模板

修改模板后，重新构建项目：

```bash
npm run build
```

### 命令参考

#### specflow init

初始化 SpecFlow 项目结构。

```bash
specflow init [选项]
```

**选项：**

- `--ai <tool>`：AI 工具类型（默认：cursor）
  - 可用：cursor, qwen, iflow, cline
- `-f, --force`：强制覆盖已存在的文件

#### specflow new

创建新的任务目录。

```bash
specflow new [名称]
```

**参数：**

- `名称`：任务名称（可选，默认："待命名"）

### 工作流指南

#### 1. 规格阶段

使用 `/flow.1-spec` 根据 `brief.md` 中的需求和 `assets/` 中的辅助材料撰写详细规格。

**输出：** `outputs/1-spec.md`

#### 2. 规划阶段

使用 `/flow.2-plan` 创建技术方案和任务拆解。

**输出：**

- `outputs/2-plan.md` - 技术方案
- `outputs/3-tasks.md` - 任务清单

#### 3. 执行阶段

使用 `/flow.3-execute` 执行任务并交付结果。

**操作：** 更新 `outputs/3-tasks.md` 中的任务完成状态

#### 4. 验收阶段

使用 `/flow.accept` 创建验收用例。

**输出：** `outputs/acceptance.md`（可选）

#### 5. 对齐阶段

当发现冲突、歧义或偏差时，使用 `/flow.align`。

**输出：** `alignment.md`（仅在需要时创建）

#### 6. 总结阶段

使用 `/flow.summary` 总结和文档化已完成的工作。

**输出：** `outputs/summary-<日期>.md`（可选）

### 优先级规则

处理信息时，应用以下优先级：

```
alignment.md > brief.md / prd.md > assets/* > 现状
```

**重要：** 当任何阶段发生变更时，需要传播变更到：

1. `1-spec.md`
2. `2-plan.md` / `3-tasks.md`
3. `acceptance.md`（如果存在）

### 测试

运行测试套件：

```bash
# 所有测试
npm test

# 监听模式
npm run test:watch

# 覆盖率报告
npm run test:coverage
```

目标测试覆盖率：≥80%

### 构建

构建项目用于生产：

```bash
npm run build
```

编译后的文件将在 `dist/` 目录中。

### 贡献

欢迎贡献！请遵循以下指南：

1. Fork 仓库
2. 创建功能分支
3. 为新功能编写测试（TDD）
4. 确保所有测试通过
5. 提交拉取请求

### 许可证

MIT License

---

## Support / 支持

For issues, questions, or contributions, please visit the [GitHub repository](https://github.com/xxih/spec-flow).

如有问题、疑问或贡献，请访问 [GitHub 仓库](https://github.com/xxih/spec-flow)。
