# 方案：nanospec CLI 实现

## 方案概述

基于 TypeScript + Node.js + commander 构建极简 CLI 工具，实现 Spec 驱动开发工作流的脚手架功能。核心包括 `init` 和 `new` 两个命令，支持多 AI 工具适配（Cursor、qwen、iflow、cline），目标代码规模约 300 行。

## 详细执行方案

### 1. 项目初始化

创建 TypeScript + Node.js 项目，配置基础开发环境和测试框架：

- 初始化 `package.json`，配置依赖（commander、typescript、tsx、vitest、@vitest/coverage-v8）
- 配置 `tsconfig.json`（ES2022 + NodeNext 模块）
- 配置 `vitest.config.ts`（Vitest 测试框架配置）
- 创建 `bin/nanospec.js` 入口文件
- 创建 `src/` 目录结构

### 2. CLI 框架搭建

使用 commander.js 构建 CLI 入口：

- `src/index.ts`：定义 `nanospec` 主命令
- 注册 `init` 子命令（支持 `--ai` 和 `--force` 参数）
- 注册 `new` 子命令（支持可选名称参数）

### 3. init 命令实现

实现项目初始化逻辑：

- 检查 `nanospec/` 目录是否已存在（未使用 `--force` 时警告退出）
- 创建 `nanospec/` 和 `nanospec/templates/` 目录结构
- 复制内置模板文件：
  - `AGENTS.md` → `nanospec/AGENTS.md`
  - `templates/outputs/*.md` → `nanospec/templates/*.md`（6 个产出物模板）
- 调用 AI 适配器生成命令文件
- 输出初始化完成提示和下一步指引

### 4. new 命令实现

实现任务目录创建逻辑：

- 检查 `nanospec/` 目录是否存在（未初始化时错误退出）
- 生成带日期戳的目录名：`YYYYMMDD-<名称>`
- 创建任务目录结构：`brief.md`、`assets/`、`outputs/`
- 创建空的 `brief.md` 文件（包含任务名称标题和占位符）
- 输出创建成功提示和下一步指引

### 5. AI 适配器架构

定义统一的适配器接口并实现注册机制，支持格式转换和内容定制：

- `src/adapters/index.ts`：定义 `AIAdapter` 接口，实现适配器注册表
- 接口支持：
  - `fileFormat`：指定命令文件格式（md、toml、json、yaml）
  - `transformCommand`：格式转换方法，将通用模板转换为特定AI工具格式
  - `supportsVariables`：是否支持变量替换
- 支持动态获取适配器：`getAdapter(name)`
- 支持列出所有适配器：`listAdapters()`

**参考 OpenSpec 实现**：

- OpenSpec 为不同AI工具提供独立的适配器实现
- 支持格式转换、变量替换、内容定制
- 模板管理更加灵活，支持通用模板和特定模板

### 6. Cursor 适配器实现

实现 Cursor 命令生成：

- 创建 `.cursor/commands/` 目录
- 复制 6 个命令模板文件到目标目录
- 命令文件：`flow.1-spec.md`、`flow.2-plan.md`、`flow.3-execute.md`、`flow.accept.md`、`flow.align.md`、`flow.summary.md`
- Cursor 使用 Markdown 格式，直接复制模板即可

### 7. qwen 适配器实现

实现 qwen 命令生成，支持格式转换：

- 创建 `.qwen/commands/` 目录
- 实现格式转换逻辑：从通用 Markdown 模板转换为 qwen 特定格式
- 验证命令文件格式符合 qwen 规范
- 处理 qwen 特定的语法和结构要求

### 8. iflow 适配器实现

实现 iflow 命令生成，支持 Markdown 到 TOML 的格式转换：

- 创建 `.iflow/commands/` 目录
- 实现 `transformCommand` 方法：将 Markdown 模板转换为 TOML 格式
- 处理 iflow 特定的字段：
  - `# Command:` → `[command] name =`
  - `# Description:` → `description =`
  - `# Category:` → `category =`
  - `# Version:` → `version =`
  - `prompt =` 部分 → 保持为多行字符串
- 验证 TOML 格式符合 iflow 规范

### 9. cline 适配器实现

实现 cline 命令生成，支持格式转换：

- 创建 `.cline/commands/` 目录
- 实现格式转换逻辑：从通用 Markdown 模板转换为 cline 特定格式
- 验证命令文件格式符合 cline 规范
- 处理 cline 特定的语法和结构要求

### 10. 模板管理优化

优化模板管理结构，支持更灵活的适配：

```
src/templates/
├── commands/                   # 通用命令模板（Markdown 格式）
│   ├── flow.1-spec.md.base
│   ├── flow.2-plan.md.base
│   ├── flow.3-execute.md.base
│   ├── flow.accept.md.base
│   ├── flow.align.md.base
│   └── flow.summary.md.base
└── adapters/                   # AI工具特定模板（可选）
    ├── cursor/
    │   └── flow.*.md          # Cursor 特定模板（可选）
    ├── iflow/
    │   └── flow.*.toml        # iflow 特定模板（可选）
    ├── qwen/
    │   └── flow.*.md          # qwen 特定模板（可选）
    └── cline/
        └── flow.*.md          # cline 特定模板（可选）
```

**模板选择策略**：

1. 优先使用AI工具特定的模板（如果存在）
2. 否则使用通用模板（.base 文件），通过 `transformCommand` 转换
3. 支持变量替换（如 {{date}}、{{version}}、{{specs_dir}}）

### 10. 内置模板准备

准备所有内置模板文件：

- `src/templates/AGENTS.md`：通用规则文档（从现有 `nanospec/AGENTS.md` 复制）
- `src/templates/commands/`：6 个斜杠命令模板（从现有 `.iflow/commands/` 复制）
- `src/templates/outputs/`：6 个产出物模板（从 `nanospec/init-nanospec/assets/templates/` 复制）

### 11. 错误处理与用户体验

完善错误处理和用户提示：

- 目录已存在时的警告提示
- 不支持的 AI 工具时的错误提示（列出支持的选项）
- 未初始化时运行 `new` 命令的错误提示
- 所有操作的成功/失败状态反馈

### 12. 构建与测试

配置构建流程并进行 TDD 开发：

- 配置 `npm run build`（tsc 编译）
- 配置 `npm run dev`（tsx 执行）
- 配置 `npm test`（运行 Vitest 测试）
- 配置 `npm run test:watch`（监听模式运行测试）
- 配置 `npm run test:coverage`（生成测试覆盖率报告）
- 采用 TDD 开发流程：先写测试 → 实现功能 → 重构代码
- 测试 `nanospec init` 命令（默认 Cursor）
- 测试 `nanospec init --ai qwen`、`--ai iflow`、`--ai cline`
- 测试 `nanospec init --force` 强制覆盖
- 测试 `nanospec new` 创建任务目录
- 验证所有生成的文件和目录结构正确
- 验证测试覆盖率 ≥80%
