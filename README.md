# NanoSpec CLI

[English](#english) | [中文](#中文)

---

## 中文

一个极简且可扩展的 Spec-Driven 框架。不仅适用于代码——也适用于写作、研究和任何你想完成的事情。

### 快速开始（3 分钟上手）

```bash
# 1. 安装
npm install -g nano-spec

# 2. 在你的项目中初始化（交互式选择 AI 工具）
nanospec init

# 3. 创建第一个任务
nanospec new "用户登录功能"

# 4. 编辑 brief.md 描述需求，然后使用 AI 工具中的斜杠命令：
#    /spec.1-spec → /spec.2-plan → /spec.3-execute
```

就这么简单！你的项目现在有了一个标准化的规格驱动开发工作流。

---

### 为什么选择 NanoSpec？

**🎯 专注工作流，不绑定工具**

- 支持 9 个主流 AI 工具：Cursor、Codex、Qwen、iFlow、Cline、Claude Code、GitHub Copilot、Windsurf、Kilo Code
- 团队成员用不同工具，依然保持统一的协作规范
- 随时切换工具，无缝衔接

**📦 开箱即用，零配置**

- 一条命令初始化项目结构
- 内置完整工作流命令（规格 → 方案 → 执行 → 验收）
- 4 个领域预设包（前端、后端、重构、文档），一键安装

**🔄 支持断点续作**

- 自动记录当前任务，随时中断下次继续
- 多任务并行，快速切换
- 对齐记录机制，确保变更一致性

**⚙️ 高度可定制**

- 多级配置系统（项目级 > 用户级 > 默认）
- 自定义模板和命令
- 通过预设包快速注入领域能力

---

### 典型使用场景

**场景 1：前端团队开发新功能**

```bash
# 初始化项目（选择 Cursor + GitHub Copilot）
nanospec init

# 安装前端预设包（包含组件/状态/交互规范）
nanospec preset install frontend

# 创建任务
nanospec new "购物车功能"

# 在 Cursor 中使用 /spec.1-spec 撰写规格
# AI 会自动应用前端预设的规范
```

**场景 2：后端团队重构 API**

```bash
# 初始化项目（选择 Qwen）
nanospec init

# 安装重构预设包（包含评审/风险控制清单）
nanospec preset install refactor

# 创建任务
nanospec new "用户 API 重构"

# 使用 /spec.run 一键执行工作流
# AI 会自动检查 API 设计规范和潜在风险
```

**场景 3：个人写技术文档**

```bash
# 初始化项目
nanospec init

# 安装文档预设包（包含信息架构/受众分析模板）
nanospec preset install docs

# 创建任务
nanospec new "系统架构文档"

# 使用 /spec.clarify 澄清模糊点
# AI 会帮你检查信息架构是否完整
```

---

### 核心工作流

NanoSpec 将工作流标准化为 6 个阶段，每个阶段都有明确的产出物：

```
brief.md（需求）
    ↓
1-spec.md（规格）
    ↓
2-plan.md（方案） + 3-tasks.md（任务清单）
    ↓
执行任务（逐项完成并勾选）
    ↓
acceptance.md（验收）
    ↓
summary.md（总结）
```

**对齐机制**：任何阶段发现问题，使用 `/spec.align` 记录并跟踪关闭。

---

### CLI 命令速查

| 命令     | 说明                               | 示例                                   |
| -------- | ---------------------------------- | -------------------------------------- |
| `init`   | 初始化项目（交互式选择 AI 工具）   | `nanospec init`                        |
| `new`    | 创建新任务（自动设为当前任务）     | `nanospec new "任务名"`                |
| `switch` | 切换当前任务（无参数时交互式选择） | `nanospec switch`                      |
| `status` | 查看当前状态                       | `nanospec status`                      |
| `config` | 配置管理                           | `nanospec config set specs_root specs` |
| `preset` | 预设包管理                         | `nanospec preset install frontend`     |
| `sync`   | 同步命令到 AI 工具                 | `nanospec sync --adapter cursor`       |

**AI 工具中的斜杠命令**：

- `/spec.1-spec` - 撰写规格
- `/spec.2-plan` - 创建技术方案和任务拆解
- `/spec.3-execute` - 执行交付
- `/spec.accept` - 创建验收用例
- `/spec.align` - 对齐纠偏
- `/spec.summary` - 总结沉淀
- `/spec.init` - 初始化或创建任务（辅助）
- `/spec.run` - 一键执行工作流（辅助）
- `/spec.clarify` - 澄清规格模糊点（辅助）

---

### 配置系统

NanoSpec 支持多级配置，优先级：**项目级 > 用户级 > 默认**

**配置文件位置**：

- 项目级：`.nanospecrc` 或 `nanospec.config.js`（项目根目录）
- 用户级：`~/.nanospecrc`

**常用配置项**：

```json
{
	"specs_root": "nanospec", // 规格根目录名
	"cmd_prefix": "spec", // 命令前缀
	"default_adapter": "cursor", // 默认 AI 工具
	"auto_sync": true // init 时自动同步
}
```

**配置命令**：

```bash
# 查看当前配置
nanospec config

# 设置配置
nanospec config set specs_root specs

# 设置全局配置
nanospec config set default_adapter qwen --global

# 删除配置项
nanospec config unset specs_root
```

---

### 预设包系统

预设包是领域特化的规则和命令模板集合，一键安装即可获得领域能力。

**内置预设**：

| 预设       | 说明                                  |
| ---------- | ------------------------------------- |
| `frontend` | 前端开发特化（组件/状态/交互规范）    |
| `backend`  | 后端开发特化（API/数据模型/服务架构） |
| `refactor` | 重构优化（评审/风险控制清单）         |
| `docs`     | 文档写作（信息架构/受众分析模板）     |

**预设命令**：

```bash
# 列出所有预设
nanospec preset list

# 安装预设
nanospec preset install frontend

# 卸载预设
nanospec preset uninstall frontend
```

---

### 项目结构

初始化后的项目结构：

```
your-project/
├── nanospec/
│   ├── AGENTS.md                    # 通用规范和指南
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
├── .nanospec/
│   ├── current-task                 # 当前任务指针
│   └── config.json                  # 项目级配置（可选）
├── .codex/commands/                 # Codex 命令（如果使用）
├── .cursor/commands/                # Cursor 命令（如果使用）
│   ├── spec.1-spec.md
│   ├── spec.2-plan.md
│   └── ...
└── ... (其他项目文件)
```

---

### 支持的 AI 工具

NanoSpec 支持以下 AI 工具，通过适配器自动生成对应的命令文件：

- ✅ Cursor
- ✅ Codex
- ✅ Qwen
- ✅ iFlow
- ✅ Cline
- ✅ Claude Code
- ✅ GitHub Copilot
- ✅ Windsurf
- ✅ Kilo Code

**添加新工具**：只需在 `src/adapters/` 创建适配器，无需修改核心代码。

---

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

---

### 常见问题

**Q: 如何在不同 AI 工具之间切换？**

A: 使用 `nanospec sync --adapter <工具名>` 同步命令到新的工具。

**Q: 如何创建自定义预设？**

A: 在 `src/presets/` 创建目录，包含 `preset.json`、`commands/` 和 `templates/`。

**Q: 任务指针文件损坏了怎么办？**

A: 使用 `nanospec switch` 交互式选择任务，会自动修复指针。

**Q: 如何配置多人的协作规范？**

A: 将 `.nanospecrc` 提交到 Git，团队成员共享统一的配置。

---

### 贡献

欢迎贡献！请遵循以下指南：

1. Fork 仓库
2. 创建功能分支
3. 确保所有测试通过（`npm test`）
4. 提交拉取请求

### 许可证

MIT License

---

## English

A minimal extendable Spec-Driven framework. Not just for code -- for writing, research, and anything you want to get done.

### Quick Start (3 minutes)

```bash
# 1. Install
npm install -g nano-spec

# 2. Initialize in your project (interactive AI tool selection)
nanospec init

# 3. Create your first task
nanospec new "User Login"

# 4. Edit brief.md to describe requirements, then use slash commands in AI tools:
#    /spec.1-spec → /spec.2-plan → /spec.3-execute
```

That's it! Your project now has a standardized spec-driven development workflow.

---

### Why NanoSpec?

**🎯 Workflow-focused, Tool-agnostic**

- Supports 8 mainstream AI tools: Cursor, Qwen, iFlow, Cline, Claude Code, GitHub Copilot, Windsurf, Kilo Code
- Team members using different tools still maintain unified collaboration standards
- Switch tools anytime, seamless transition

**📦 Ready to Use, Zero Configuration**

- One command to initialize project structure
- Built-in complete workflow commands (spec → plan → execute → accept)
- 4 domain presets (frontend, backend, refactor, docs), one-click install

**🔄 Supports Resumable Work**

- Auto-record current task, interrupt and continue anytime
- Multi-task parallel processing, quick switching
- Alignment mechanism ensures change consistency

**⚙️ Highly Customizable**

- Multi-level configuration system (project > user > default)
- Custom templates and commands
- Quickly inject domain capabilities through presets

---

### Typical Use Cases

**Scenario 1: Frontend Team Developing New Features**

```bash
# Initialize project (select Cursor + GitHub Copilot)
nanospec init

# Install frontend preset (includes component/state/interaction specs)
nanospec preset install frontend

# Create task
nanospec new "Shopping Cart"

# Use /spec.1-spec in Cursor to write specs
# AI will automatically apply frontend preset standards
```

**Scenario 2: Backend Team Refactoring APIs**

```bash
# Initialize project (select Qwen)
nanospec init

# Install refactor preset (includes review/risk control checklist)
nanospec preset install refactor

# Create task
nanospec new "User API Refactor"

# Use /spec.run to execute workflow in one click
# AI will automatically check API design standards and potential risks
```

**Scenario 3: Personal Technical Documentation**

```bash
# Initialize project
nanospec init

# Install docs preset (includes info architecture/audience analysis templates)
nanospec preset install docs

# Create task
nanospec new "System Architecture Docs"

# Use /spec.clarify to clarify ambiguous points
# AI will help you check if info architecture is complete
```

---

### Core Workflow

NanoSpec standardizes workflow into 6 phases, each with clear deliverables:

```
brief.md (requirements)
    ↓
1-spec.md (specification)
    ↓
2-plan.md (plan) + 3-tasks.md (task list)
    ↓
Execute tasks (complete and check one by one)
    ↓
acceptance.md (acceptance)
    ↓
summary.md (summary)
```

**Alignment Mechanism**: Use `/spec.align` to record and track closure when issues arise in any phase.

---

### CLI Commands Quick Reference

| Command  | Description                                        | Example                                |
| -------- | -------------------------------------------------- | -------------------------------------- |
| `init`   | Initialize project (interactive AI tool selection) | `nanospec init`                        |
| `new`    | Create new task (auto-set as current)              | `nanospec new "Task Name"`             |
| `switch` | Switch current task (interactive if no args)       | `nanospec switch`                      |
| `status` | View current status                                | `nanospec status`                      |
| `config` | Configuration management                           | `nanospec config set specs_root specs` |
| `preset` | Preset package management                          | `nanospec preset install frontend`     |
| `sync`   | Sync commands to AI tools                          | `nanospec sync --adapter cursor`       |

**Slash Commands in AI Tools**:

- `/spec.1-spec` - Write specifications
- `/spec.2-plan` - Create technical plan and task breakdown
- `/spec.3-execute` - Execute and deliver
- `/spec.accept` - Create acceptance test cases
- `/spec.align` - Align and correct deviations
- `/spec.summary` - Summarize and document
- `/spec.init` - Initialize or create task (helper)
- `/spec.run` - Execute workflow in one click (helper)
- `/spec.clarify` - Clarify ambiguous points in specs (helper)

---

### Configuration System

NanoSpec supports multi-level configuration with priority: **project > user > default**

**Configuration File Locations**:

- Project-level: `.nanospecrc` or `nanospec.config.js` (project root)
- User-level: `~/.nanospecrc`

**Common Configuration Options**:

```json
{
	"specs_root": "nanospec", // Specs root directory name
	"cmd_prefix": "spec", // Command prefix
	"default_adapter": "cursor", // Default AI tool
	"auto_sync": true // Auto sync on init
}
```

**Configuration Commands**:

```bash
# View current configuration
nanospec config

# Set configuration
nanospec config set specs_root specs

# Set global configuration
nanospec config set default_adapter qwen --global

# Remove configuration item
nanospec config unset specs_root
```

---

### Preset System

Presets are domain-specific rule and command template collections, one-click install to gain domain capabilities.

**Built-in Presets**:

| Preset     | Description                                                              |
| ---------- | ------------------------------------------------------------------------ |
| `frontend` | Frontend development specialization (component/state/interaction specs)  |
| `backend`  | Backend development specialization (API/data model/service architecture) |
| `refactor` | Refactoring optimization (review/risk control checklist)                 |
| `docs`     | Documentation writing (info architecture/audience analysis templates)    |

**Preset Commands**:

```bash
# List all presets
nanospec preset list

# Install preset
nanospec preset install frontend

# Uninstall preset
nanospec preset uninstall frontend
```

---

### Project Structure

Project structure after initialization:

```
your-project/
├── nanospec/
│   ├── AGENTS.md                    # General rules and guidelines
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
├── .nanospec/
│   ├── current-task                 # Current task pointer
│   └── config.json                  # Project-level config (optional)
├── .codex/commands/                 # Codex commands (if used)
├── .cursor/commands/                # Cursor commands (if used)
│   ├── spec.1-spec.md
│   ├── spec.2-plan.md
│   └── ...
└── ... (other project files)
```

---

### Supported AI Tools

NanoSpec supports the following AI tools, automatically generating corresponding command files through adapters:

- ✅ Cursor
- ✅ Codex
- ✅ Qwen
- ✅ iFlow
- ✅ Cline
- ✅ Claude Code
- ✅ GitHub Copilot
- ✅ Windsurf
- ✅ Kilo Code

**Adding New Tools**: Just create an adapter in `src/adapters/`, no need to modify core code.

---

### Installation

#### Global Installation

```bash
npm install -g nano-spec
```

#### Local Development

```bash
# Clone repository
git clone <repository-url>
cd nano-spec

# Install dependencies
npm install

# Build project
npm run build

# Link globally for testing
npm link
```

---

### FAQ

**Q: How to switch between different AI tools?**

A: Use `nanospec sync --adapter <tool>` to sync commands to the new tool.

**Q: How to create custom presets?**

A: Create a directory in `src/presets/`, containing `preset.json`, `commands/`, and `templates/`.

**Q: What if the task pointer file is corrupted?**

A: Use `nanospec switch` to interactively select a task, which will automatically fix the pointer.

**Q: How to configure multi-person collaboration standards?**

A: Commit `.nanospecrc` to Git, team members share unified configuration.

---

### Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch
3. Ensure all tests pass (`npm test`)
4. Submit a pull request

### License

MIT License

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
├── .nanospec/
│   └── current-task                 # 当前任务指针
├── .codex/commands/                 # Codex 命令（如果使用）
├── .cursor/commands/                # Cursor 命令（如果使用）
│   ├── spec.1-spec.md
│   ├── spec.2-plan.md
│   ├── spec.3-execute.md
│   ├── spec.accept.md
│   ├── spec.align.md
│   └── spec.summary.md
├── .nanospecrc                      # 项目级配置（可选）
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
  - 可用：cursor, codex, qwen, iflow, cline, claude-code, copilot, windsurf, kilo-code
- `-f, --force`：强制覆盖已存在的文件

#### nanospec new

创建新的任务目录。

```bash
nanospec new [名称]
```

**参数：**

- `名称`：任务名称（可选，默认："待命名"）

#### nanospec switch

切换当前任务。

```bash
nanospec switch [名称]
```

**参数：**

- `名称`：任务名称（可选，不提供时显示当前任务和可用任务列表）

**说明：**

- 切换任务后，所有工作流命令将默认使用当前任务
- 创建新任务时会自动设置为当前任务

#### nanospec status

显示当前状态。

```bash
nanospec status
```

**输出：**

- 当前配置信息
- 当前任务信息
- 所有任务列表及进度

#### nanospec preset

预设包管理。

```bash
nanospec preset list          # 列出所有可用预设
nanospec preset install <name>  # 安装预设
nanospec preset uninstall <name> # 卸载预设
```

**可用预设：**

- `frontend` - 前端开发特化预设
- `backend` - 后端开发特化预设
- `refactor` - 重构优化预设
- `docs` - 文档写作预设

#### nanospec sync

同步命令到 AI 工具。

```bash
nanospec sync [选项]
```

**选项：**

- `--adapter <name>`：指定 AI 工具（可选，默认同步所有工具）

### 配置系统

NanoSpec 支持通过配置文件自定义行为。配置文件优先级：项目级 > 用户级 > 默认。

#### 配置文件位置

- **项目级**：`.nanospecrc` 或 `nanospec.config.js`（项目根目录）
- **用户级**：`~/.nanospecrc`（用户主目录）

#### 配置项

```json
{
	"specs_root": "nanospec", // 规格根目录名（默认：nanospec）
	"cmd_prefix": "spec", // 命令前缀（默认：spec）
	"default_adapter": "cursor", // 默认 AI 工具（默认：cursor）
	"template_format": "md", // 模板格式（默认：md）
	"auto_sync": true // init 时自动同步（默认：true）
}
```

#### 配置示例

**JSON 格式（.nanospecrc）：**

```json
{
	"specs_root": "specs",
	"default_adapter": "qwen"
}
```

**JavaScript 格式（nanospec.config.js）：**

```javascript
module.exports = {
	specs_root: 'specs',
	default_adapter: 'qwen',
	template_format: 'toml'
};
```

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

## English

A minimal extendable Spec-Driven framework. Not just for code -- for writing, research, and anything you want to get done.

### Overview

NanoSpec CLI is a lightweight command-line tool that helps you quickly initialize a Spec-Driven Development workflow project structure. It supports multiple AI tools (Cursor, codex, qwen, iflow, cline, claude-code, copilot, windsurf, kilo-code) and provides a standardized workflow for specification, planning, execution, and acceptance.

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
nanospec init --ai codex
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
├── .nanospec/
│   └── current-task                 # Current task pointer
├── .codex/commands/                 # Codex commands (if used)
├── .cursor/commands/                # Cursor commands (if used)
│   ├── spec.1-spec.md
│   ├── spec.2-plan.md
│   ├── spec.3-execute.md
│   ├── spec.accept.md
│   ├── spec.align.md
│   └── spec.summary.md
├── .nanospecrc                      # Project-level configuration (optional)
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
  - Available: cursor, codex, qwen, iflow, cline, claude-code, copilot, windsurf, kilo-code
- `-f, --force`: Force overwrite existing files

#### nanospec new

Create a new task directory.

```bash
nanospec new [name]
```

**Arguments:**

- `name`: Task name (optional, default: "待命名")

#### nanospec switch

Switch current task.

```bash
nanospec switch [name]
```

**Arguments:**

- `name`: Task name (optional, displays current task and available tasks if not provided)

**Description:**

- After switching tasks, all workflow commands will use the current task by default
- Creating a new task automatically sets it as the current task

#### nanospec status

Display current status.

```bash
nanospec status
```

**Output:**

- Current configuration
- Current task information
- List of all tasks and their progress

#### nanospec preset

Preset package management.

```bash
nanospec preset list          # List all available presets
nanospec preset install <name>  # Install preset
nanospec preset uninstall <name> # Uninstall preset
```

**Available Presets:**

- `frontend` - Frontend development specialization
- `backend` - Backend development specialization
- `refactor` - Refactoring optimization
- `docs` - Documentation writing

#### nanospec sync

Sync commands to AI tools.

```bash
nanospec sync [options]
```

**Options:**

- `--adapter <name>`: Specify AI tool (optional, syncs all tools by default)

### Configuration System

NanoSpec supports customization through configuration files. Configuration priority: project-level > user-level > default.

#### Configuration File Locations

- **Project-level**: `.nanospecrc` or `nanospec.config.js` (project root)
- **User-level**: `~/.nanospecrc` (user home directory)

#### Configuration Options

```json
{
	"specs_root": "nanospec", // Specs root directory name (default: nanospec)
	"cmd_prefix": "spec", // Command prefix (default: spec)
	"default_adapter": "cursor", // Default AI tool (default: cursor)
	"template_format": "md", // Template format (default: md)
	"auto_sync": true // Auto sync on init (default: true)
}
```

#### Configuration Examples

**JSON format (.nanospecrc):**

```json
{
	"specs_root": "specs",
	"default_adapter": "qwen"
}
```

**JavaScript format (nanospec.config.js):**

```javascript
module.exports = {
	specs_root: 'specs',
	default_adapter: 'qwen',
	template_format: 'toml'
};
```

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
