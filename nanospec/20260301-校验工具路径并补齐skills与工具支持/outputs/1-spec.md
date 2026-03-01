# 规格说明：校验工具路径并补齐 Skills 与工具支持

## 背景

当前 nano-spec 已支持 `cursor`、`codex`、`qwen`、`iflow`、`cline`、`claude-code`、`copilot`、`windsurf`、`kilo-code`。
本次需求要求：
1. 审核这些工具的资产输出路径是否正确。
2. 审核这些工具是否支持 skills；若支持，则补齐 skills 生成。
3. 调研并补上尚未支持的重要工具。

## 调研结论（以官方文档为准）

- `copilot` 的项目级提示词目录是 `.github/prompts/`，并使用 `.prompt.md` 扩展名；当前实现写入 `.github/copilot/commands/`，路径与格式不匹配，需要修正。
- `claude-code` 支持项目级与用户级 commands（`.claude/commands`、`~/.claude/commands`）以及 skills（`.claude/skills`、`~/.claude/skills`）；当前仅支持 commands 且仅项目级，需要补齐 skills 并支持 scope。
- `gemini-cli` 是重要缺失工具，支持 `.gemini/commands/`（项目级）与 `~/.gemini/commands/`（用户级），可纳入适配器。
- 现有 `codex` 的 `.codex/prompts` 与 `.codex/skills` 路径设计保持不变。

## 范围

### In Scope

1. 修正 `copilot` 适配器输出路径与文件扩展名。
2. 为 `claude-code` 适配器新增 skills 同步能力。
3. 为 `claude-code` 与 `gemini` 增加 `project|user` scope 路径支持。
4. 新增 `gemini` 适配器并接入 `init/sync/listAdapters`。
5. 补齐对应测试与 README / CHANGELOG。

### Out of Scope

1. 重构全部适配器的输出机制。
2. 引入除现有 skills 目录之外的新 skill 模板体系。

## 验收标准

1. `copilot` 同步结果落在 `.github/prompts/*.prompt.md`。
2. `claude-code` 在 `--assets skills` 下可生成 `skills`（项目级与用户级均支持）。
3. `gemini` 出现在支持列表并可成功生成 commands。
4. 相关单测新增/更新并通过。
5. README 与 CHANGELOG 反映本次交付。
