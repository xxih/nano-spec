# 方案：SpecFlow CLI 实现

## 方案概述

基于 TypeScript + Node.js + commander 构建极简 CLI 工具，实现 Spec 驱动开发工作流的脚手架功能。核心包括 `init` 和 `new` 两个命令，支持多 AI 工具适配（Cursor、qwen、iflow、cline），目标代码规模约 300 行。

## 详细执行方案

### 1. 项目初始化

创建 TypeScript + Node.js 项目，配置基础开发环境和测试框架：

- 初始化 `package.json`，配置依赖（commander、typescript、tsx、vitest、@vitest/coverage-v8）
- 配置 `tsconfig.json`（ES2022 + NodeNext 模块）
- 配置 `vitest.config.ts`（Vitest 测试框架配置）
- 创建 `bin/specflow.js` 入口文件
- 创建 `src/` 目录结构

### 2. CLI 框架搭建

使用 commander.js 构建 CLI 入口：

- `src/index.ts`：定义 `specflow` 主命令
- 注册 `init` 子命令（支持 `--ai` 和 `--force` 参数）
- 注册 `new` 子命令（支持可选名称参数）

### 3. init 命令实现

实现项目初始化逻辑：

- 检查 `specflow/` 目录是否已存在（未使用 `--force` 时警告退出）
- 创建 `specflow/` 和 `specflow/templates/` 目录结构
- 复制内置模板文件：
  - `AGENTS.md` → `specflow/AGENTS.md`
  - `templates/outputs/*.md` → `specflow/templates/*.md`（6 个产出物模板）
- 调用 AI 适配器生成命令文件
- 输出初始化完成提示和下一步指引

### 4. new 命令实现

实现任务目录创建逻辑：

- 检查 `specflow/` 目录是否存在（未初始化时错误退出）
- 生成带日期戳的目录名：`YYYYMMDD-<名称>`
- 创建任务目录结构：`brief.md`、`assets/`、`outputs/`
- 创建空的 `brief.md` 文件（包含任务名称标题和占位符）
- 输出创建成功提示和下一步指引

### 5. AI 适配器架构

定义统一的适配器接口并实现注册机制：

- `src/adapters/index.ts`：定义 `AIAdapter` 接口，实现适配器注册表
- 支持动态获取适配器：`getAdapter(name)`
- 支持列出所有适配器：`listAdapters()`

### 6. Cursor 适配器实现

实现 Cursor 命令生成：

- 创建 `.cursor/commands/` 目录
- 复制 6 个命令模板文件到目标目录
- 命令文件：`flow.1-spec.md`、`flow.2-plan.md`、`flow.3-execute.md`、`flow.accept.md`、`flow.align.md`、`flow.summary.md`

### 7. qwen 适配器实现

实现 qwen 命令生成（直接复制格式）：

- 创建 `.qwen/commands/` 目录
- 复制 6 个命令模板文件到目标目录
- 验证命令文件格式符合 qwen 规范

### 8. iflow 适配器实现

实现 iflow 命令生成（TOML 格式）：

- 创建 `.iflow/commands/` 目录
- 复制 6 个命令模板文件（.toml 格式）到目标目录
- 验证 TOML 格式符合 iflow 规范

### 9. cline 适配器实现

实现 cline 命令生成：

- 创建 `.cline/commands/` 目录
- 复制 6 个命令模板文件到目标目录
- 验证命令文件格式符合 cline 规范

### 10. 内置模板准备

准备所有内置模板文件：

- `src/templates/AGENTS.md`：通用规则文档（从现有 `specflow/AGENTS.md` 复制）
- `src/templates/commands/`：6 个斜杠命令模板（从现有 `.iflow/commands/` 复制）
- `src/templates/outputs/`：6 个产出物模板（从 `specflow/init-specflow/assets/templates/` 复制）

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
- 测试 `specflow init` 命令（默认 Cursor）
- 测试 `specflow init --ai qwen`、`--ai iflow`、`--ai cline`
- 测试 `specflow init --force` 强制覆盖
- 测试 `specflow new` 创建任务目录
- 验证所有生成的文件和目录结构正确
- 验证测试覆盖率 ≥80%