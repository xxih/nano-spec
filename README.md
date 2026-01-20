# NanoSpec CLI

[English](#english) | [中文](#中文)

---

## English

A minimal extendable Spec-Driven framework. Not just for code -- for writing, research, and anything you want to get done.

### Overview

NanoSpec CLI is a lightweight command-line tool that helps you quickly initialize a Spec-Driven Development workflow project structure. It supports multiple AI tools (Cursor, qwen, iflow, cline) and provides a standardized workflow for specification, planning, execution, and acceptance.

### Features

- **Minimal & Simple**: Only 6 slash commands, CLI focuses on initialization
- **Ready to Use**: One-command initialization with `nanospec init`
- **Multi-AI Support**: Generate command files for different AI tools
- **Customizable**: Modify templates and add common documents for customization

### Installation

#### Global Installation

```bash
npm install -g nano-spec
```

#### Local Development

```bash
# Clone the repository
git clone <repository-url>
cd nano-spec

# Install dependencies
npm install

# Build the project
npm run build

# Link globally for testing
npm link
```

### Quick Start

1. **Initialize NanoSpec in your project**

```bash
# Initialize with default AI tool (Cursor)
nanospec init

# Initialize with specific AI tool
nanospec init --ai qwen
nanospec init --ai iflow
nanospec init --ai cline

# Force overwrite existing files
nanospec init --force
```

2. **Create a new task**

```bash
# Create a task with default name
nanospec new

# Create a task with custom name
nanospec new "User Authentication"
```

3. **Start the workflow**

Edit the `brief.md` file in your task directory to describe your requirements, then use the slash commands:

- `/spec.1-spec` - Write specifications
- `/spec.2-plan` - Create technical plan and task breakdown
- `/spec.3-execute` - Execute and deliver
- `/spec.accept` - Create acceptance test cases
- `/spec.align` - Align and correct deviations
- `/spec.summary` - Summarize and document

### Project Structure

After initialization, your project will have the following structure:

```
your-project/
├── nanospec/
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
│   ├── spec.1-spec.md
│   ├── spec.2-plan.md
│   ├── spec.3-execute.md
│   ├── spec.accept.md
│   ├── spec.align.md
│   └── spec.summary.md
└── ... (other project files)
```

### Commands Reference

#### nanospec init

Initialize NanoSpec project structure.

```bash
nanospec init [options]
```

**Options:**

- `--ai <tool>`: AI tool type (default: cursor)
  - Available: cursor, qwen, iflow, cline
- `-f, --force`: Force overwrite existing files

#### nanospec new

Create a new task directory.

```bash
nanospec new [name]
```

**Arguments:**

- `name`: Task name (optional, default: "待命名")

### Workflow Guide

#### 1. Specification Phase

Use `/spec.1-spec` to write detailed specifications based on requirements in `brief.md` and supporting materials in `assets/`.

**Output:** `outputs/1-spec.md`

#### 2. Planning Phase

Use `/spec.2-plan` to create technical plans and task breakdowns.

**Outputs:**

- `outputs/2-plan.md` - Technical plan
- `outputs/3-tasks.md` - Task checklist

#### 3. Execution Phase

Use `/spec.3-execute` to execute tasks and deliver results.

**Action:** Update task completion status in `outputs/3-tasks.md`

#### 4. Acceptance Phase

Use `/spec.accept` to create acceptance test cases.

**Output:** `outputs/acceptance.md` (optional)

#### 5. Alignment Phase

Use `/spec.align` when conflicts, ambiguities, or deviations are discovered.

**Output:** `alignment.md` (created only when needed)

#### 6. Summary Phase

Use `/spec.summary` to summarize and document the completed work.

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
3. Ensure all tests pass
4. Submit a pull request

### License

MIT License

---

## 中文

一个极简且可扩展的规格驱动框架。不仅适用于代码——也适用于写作、研究和任何你想完成的事情。

### 概述

NanoSpec CLI 是一个轻量级的命令行工具，帮助你快速初始化规格驱动开发工作流的项目结构。它支持多种 AI 工具（Cursor、qwen、iflow、cline），并提供标准化的规格、规划、执行和验收工作流。

### 特性

- **极简优先**：只有 6 个斜杠命令，CLI 专注于初始化
- **即开即用**：`nanospec init` 一键初始化
- **多 AI 适配**：支持生成不同 AI 工具的命令文件
- **可定制**：通过修改模板和添加公共文档实现定制

### 安装

#### 全局安装

```bash
npm install -g nano-spec
```

#### 本地开发

```bash
# 克隆仓库
git clone <repository-url>
cd nano-spec

# 安装依赖
npm install

# 构建项目
npm run build

# 链接到全局以便测试
npm link
```

### 快速开始

1. **在项目中初始化 NanoSpec**

```bash
# 使用默认 AI 工具（Cursor）初始化
nanospec init

# 使用指定的 AI 工具初始化
nanospec init --ai qwen
nanospec init --ai iflow
nanospec init --ai cline

# 强制覆盖已存在的文件
nanospec init --force
```

2. **创建新任务**

```bash
# 创建默认名称的任务
nanospec new

# 创建自定义名称的任务
nanospec new "用户认证功能"
```

3. **开始工作流**

编辑任务目录中的 `brief.md` 文件描述需求，然后使用斜杠命令：

- `/spec.1-spec` - 撰写规格
- `/spec.2-plan` - 创建技术方案和任务拆解
- `/spec.3-execute` - 执行交付
- `/spec.accept` - 创建验收用例
- `/spec.align` - 对齐纠偏
- `/spec.summary` - 总结沉淀

### 项目结构

初始化后，你的项目将具有以下结构：

```
your-project/
├── nanospec/
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
│   ├── spec.1-spec.md
│   ├── spec.2-plan.md
│   ├── spec.3-execute.md
│   ├── spec.accept.md
│   ├── spec.align.md
│   └── spec.summary.md
└── ... (其他项目文件)
```

### 命令参考

#### nanospec init

初始化 nanospec 项目结构。

```bash
nanospec init [选项]
```

**选项：**

- `--ai <tool>`：AI 工具类型（默认：cursor）
  - 可用：cursor, qwen, iflow, cline
- `-f, --force`：强制覆盖已存在的文件

#### nanospec new

创建新的任务目录。

```bash
nanospec new [名称]
```

**参数：**

- `名称`：任务名称（可选，默认："待命名"）

### 工作流指南

#### 1. 规格阶段

使用 `/spec.1-spec` 根据 `brief.md` 中的需求和 `assets/` 中的辅助材料撰写详细规格。

**输出：** `outputs/1-spec.md`

#### 2. 规划阶段

使用 `/spec.2-plan` 创建技术方案和任务拆解。

**输出：**

- `outputs/2-plan.md` - 技术方案
- `outputs/3-tasks.md` - 任务清单

#### 3. 执行阶段

使用 `/spec.3-execute` 执行任务并交付结果。

**操作：** 更新 `outputs/3-tasks.md` 中的任务完成状态

#### 4. 验收阶段

使用 `/spec.accept` 创建验收用例。

**输出：** `outputs/acceptance.md`（可选）

#### 5. 对齐阶段

当发现冲突、歧义或偏差时，使用 `/spec.align`。

**输出：** `alignment.md`（仅在需要时创建）

#### 6. 总结阶段

使用 `/spec.summary` 总结和文档化已完成的工作。

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
3. 确保所有测试通过
4. 提交拉取请求

### 许可证

MIT License

---

## Local Development Guide / 本地开发指南

### Prerequisites / 前置要求

- Node.js >= 18
- npm or yarn
- Git (optional, for version control)

### Development Workflow / 开发工作流

1. **Clone and Setup / 克隆和设置**

```bash
git clone <repository-url>
cd nano-spec
npm install
```

2. **Development Mode / 开发模式**

```bash
# Run in development mode with tsx
# 使用 tsx 在开发模式下运行
npm run dev

# Run with specific commands
# 运行特定命令
npm run dev init
npm run dev new "My Task"
```

3. **Building / 构建**

```bash
# Build TypeScript to JavaScript
# 将 TypeScript 编译为 JavaScript
npm run build

# The output will be in the dist/ directory
# 输出将在 dist/ 目录中
```

4. **Testing / 测试**

```bash
# Run all tests
# 运行所有测试
npm test

# Run tests in watch mode
# 在监听模式下运行测试
npm run test:watch

# Generate coverage report
# 生成覆盖率报告
npm run test:coverage
```

### Project Structure for Development / 开发项目结构

```
nano-spec/
├── src/
│   ├── index.ts                    # CLI entry point / CLI 入口点
│   ├── commands/
│   │   ├── init.ts                 # nanospec init command / nanospec init 命令
│   │   └── new.ts                  # nanospec new command / nanospec new 命令
│   ├── adapters/
│   │   ├── index.ts                # Adapter registry / 适配器注册
│   │   ├── cursor.ts               # Cursor adapter / Cursor 适配器
│   │   ├── qwen.ts                 # qwen adapter / qwen 适配器
│   │   ├── iflow.ts                # iflow adapter / iflow 适配器
│   │   └── cline.ts                # cline adapter / cline 适配器
│   └── templates/                  # Built-in templates / 内置模板
│       ├── AGENTS.md
│       ├── commands/
│       │   ├── spec.1-spec.md
│       │   ├── spec.2-plan.md
│       │   ├── spec.3-execute.md
│       │   ├── spec.accept.md
│       │   ├── spec.align.md
│       │   └── spec.summary.md
│       └── outputs/
│           ├── 1-spec.md
│           ├── 2-plan.md
│           ├── 3-tasks.md
│           ├── acceptance.md
│           ├── alignment.md
│           └── summary.md
├── bin/
│   └── nanospec.js                 # CLI entry point / CLI 入口点
├── package.json
├── tsconfig.json
├── vitest.config.ts
└── README.md
```

### Adding a New AI Adapter / 添加新的 AI 适配器

1. Create adapter file in `src/adapters/` / 在 `src/adapters/` 中创建适配器文件：

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
		// 复制命令模板
		const commands = [
			'spec.1-spec.md',
			'spec.2-plan.md'
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

2. Register the adapter in `src/adapters/index.ts` / 在 `src/adapters/index.ts` 中注册适配器：

```typescript
import {mytoolAdapter} from './mytool.js';

const adapters: Record<string, AIAdapter> = {
	cursor: cursorAdapter,
	qwen: qwenAdapter,
	iflow: iflowAdapter,
	cline: clineAdapter,
	mytool: mytoolAdapter // Add new adapter / 添加新适配器
};
```

3. Add tests for the new adapter / 为新适配器添加测试

4. Run tests to ensure everything works / 运行测试确保一切正常

### Customizing Templates / 自定义模板

You can customize the templates by modifying files in `src/templates/`:
你可以通过修改 `src/templates/` 中的文件来自定义模板：

- **AGENTS.md**: General rules and guidelines / 通用规则和指南
- **commands/**: Slash command definitions / 斜杠命令定义
- **outputs/**: Output document templates / 输出文档模板

After modifying templates, rebuild the project:
修改模板后，重新构建项目：

```bash
npm run build
```

---

## Support / 支持

For issues, questions, or contributions, please visit the [GitHub repository](https://github.com/xxih/nano-spec).

如有问题、疑问或贡献，请访问 [GitHub 仓库](https://github.com/xxih/nano-spec)。
