# 方案：优化 prompt 以及简化模板机制

## 方案概述

本方案通过直接内嵌完整 prompt 到 TOML 配置文件中，实现开箱即用的命令体验。同时将 `templates/` 目录简化为仅用于存放输出产物模板的可选定制层，确保 AI 生成正确的 Markdown 格式产物。

**核心策略**：
1. 以 `assets/核心prompt/` 目录下的文件为唯一基准
2. 将完整的 prompt（包含模板结构）内嵌到每个命令的 TOML 配置文件中
3. 更新 `specflow/AGENTS.md` 为最新版本
4. 保持 `templates/` 目录仅用于输出产物模板定制

## 详细执行方案

### 1. 更新 AGENTS.md

将 `specflow/AGENTS.md` 替换为 `assets/核心prompt/AGENTS.md` 的内容。该版本包含完整的总览、结构、规则和定制章节，明确定义了模板优先级规则。

### 2. 更新命令配置文件

对六个命令的 TOML 配置文件进行更新：

**文件位置**：`.iflow/commands/flow.*.toml`

**更新内容**：
- 读取 `assets/核心prompt/flow.*.md` 的内容
- 将完整的 prompt（包含模板结构）内嵌到 TOML 的 `prompt` 字段中
- 确保 prompt 包含 Role、Objective、Inputs、Rules、Output、Checklist 等完整部分

**具体命令**：
- `flow.1-spec.toml` - 规格撰写
- `flow.2-plan.toml` - 方案设计
- `flow.3-execute.toml` - 执行交付
- `flow.accept.toml` - 验收用例
- `flow.align.toml` - 对齐纠偏
- `flow.summary.toml` - 总结沉淀

### 3. 清理 src/templates 目录

删除 `src/templates/` 目录下不再需要的参考文件：
- `src/templates/AGENTS.md`
- `src/templates/commands/flow.*.toml`
- `src/templates/outputs/1-spec.md`

保留 `src/templates/outputs/` 目录下的其他模板文件作为可选定制参考。

### 4. 验证更新

通过实际执行命令来验证更新效果：
- 执行 `/flow.1-spec` 验证生成的 `1-spec.md` 格式正确
- 执行 `/flow.2-plan` 验证生成的 `2-plan.md` 和 `3-tasks.md` 格式正确
- 确认产物为标准 Markdown 格式，不包含 TOML 文本

### 5. 文档一致性检查

确保所有文档引用路径正确：
- `AGENTS.md` 中的模板优先级规则
- 各命令 prompt 中对 `AGENTS.md` 的引用
- `templates/` 目录仅包含输出产物模板文件