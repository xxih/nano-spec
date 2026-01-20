# 方案：项目更名为 nano-spec

## 方案概述

本方案采用**批量替换 + 分阶段验证**的策略，将项目中所有 `flow.` 前缀和 `nanospec` 引用替换为 `spec.` 和 `nano-spec`。通过系统化的任务拆解，确保覆盖所有 255 处引用，同时保持代码逻辑不变。

## 详细执行方案

### 阶段 1：核心配置文件重命名

**目标**：重命名命令配置文件，这是最基础的变更。

**操作步骤**：

1. 重命名 `.iflow/commands/` 目录下的 6 个 TOML 文件
   - `flow.1-spec.toml` → `spec.1-spec.toml`
   - `flow.2-plan.toml` → `spec.2-plan.toml`
   - `flow.3-execute.toml` → `spec.3-execute.toml`
   - `flow.accept.toml` → `spec.accept.toml`
   - `flow.align.toml` → `spec.align.toml`
   - `flow.summary.toml` → `spec.summary.toml`

2. 更新每个重命名后的文件内容
   - 文件内的 `# Command: flow.*` → `# Command: spec.*`
   - 文件内的 prompt 中的 `/<cmd_prefix>.*` 引用保持不变（使用变量）

### 阶段 2：适配器代码更新

**目标**：更新所有适配器代码中的命令数组。

**操作步骤**：

1. 更新 `src/adapters/` 下的 4 个适配器文件
   - `cursor.ts`、`qwen.ts`、`cline.ts`、`iflow.ts`
   - 将 `commands` 数组中的 `'flow.*'` 改为 `'spec.*'`

2. 更新 `src/adapters/utils.ts`
   - 注释中的示例从 `flow.1-spec` 改为 `spec.1-spec`

### 阶段 3：测试文件更新

**目标**：更新所有测试文件中的命令引用。

**操作步骤**：

1. 更新 `src/adapters/` 下的 5 个测试文件
   - `cursor.test.ts`、`qwen.test.ts`、`cline.test.ts`、`iflow.test.ts`、`index.test.ts`
   - 将所有 `flow.*.md` 或 `flow.*.toml` 字符串改为 `spec.*.md` 或 `spec.*.toml`

2. 更新 `src/commands/` 下的测试文件
   - `init.test.ts`、`new.test.ts`
   - 更新所有命令引用

### 阶段 4：源代码更新

**目标**：更新所有源代码文件中的字符串引用和注释。

**操作步骤**：

1. 更新 `src/commands/init.ts`
   - 提示信息中的 `/flow.1-spec` → `/spec.1-spec`

2. 更新 `src/commands/new.ts`
   - 提示信息中的 `/flow.1-spec` → `/spec.1-spec`

3. 更新 `src/adapters/index.ts`
   - 注释中的示例从 `flow.1-spec` 改为 `spec.1-spec`

### 阶段 5：项目元数据更新

**目标**：更新 package.json 和 README.md。

**操作步骤**：

1. 更新 `package.json`
   - `name`: `"nanospec-cli"` → `"nano-spec-cli"`
   - `description`: 更新描述文本

2. 更新 `README.md`
   - 标题 "nanospec CLI" → "nano-spec CLI"
   - 所有 `/flow.*` → `/spec.*`
   - 所有 `flow.*.md` → `spec.*.md`
   - 所有 "nanospec" → "nano-spec"

### 阶段 6：规范文档更新

**目标**：更新 AGENTS.md 和其他文档。

**操作步骤**：

1. 更新 `nanospec/AGENTS.md`
   - `<cmd_prefix>` 值从 `flow` 改为 `spec`
   - 所有 `/<cmd_prefix>.*` 引用自动更新为 `/spec.*`

2. 更新历史任务文档（可选）
   - `nanospec/20260119-init-nanospec/outputs/*.md`
   - `nanospec/20260120-优化prompt以及简化模板机制/outputs/*.md`
   - 这些是历史记录，可以保留原样或更新以保持一致性

### 阶段 7：构建和测试验证

**目标**：确保所有更改后项目仍能正常工作。

**操作步骤**：

1. 运行 `npm run build` 验证编译通过
2. 运行 `npm test` 确保所有测试通过
3. 验证生成的命令文件名和内容正确
4. 检查是否有遗漏的引用（使用搜索工具）

### 阶段 8：清理和收尾

**目标**：清理临时文件，确保项目状态干净。

**操作步骤**：

1. 检查是否有旧的 `flow.*` 文件残留
2. 更新 git 状态（如果需要）
3. 更新文档中的版本号（如果需要）
