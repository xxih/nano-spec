# 规格说明：移除 codex 项目级 prompts 输出能力

## 背景

已确认 Codex 不读取项目级 `.codex/prompts`，仅用户级 `~/.codex/prompts` 生效。
继续保留 project scope 的 codex commands 会造成误导和无效输出。

## 需求

1. `codex` commands 必须固定输出到 `~/.codex/prompts`。
2. 当用户传入 `--scope project` 且资产包含 `codex` commands 时，行为应自动回退为 user，并给出提示。
3. `codex` skills 的 scope 逻辑保持不变（仍支持 project/user）。
4. README 需明确 codex commands 仅用户级生效。
5. CHANGELOG 记录本次行为变更。
6. 单测覆盖以下场景：
   - codex adapter 在 project scope 下不会写项目目录；
   - sync 命令在 codex+project scope 下仍写用户目录；
   - init 测试在受控 home 目录下稳定运行。

## 验收标准

- `nanospec sync --adapter codex --assets commands --scope project` 的结果目录为 `~/.codex/prompts`（或测试注入的 home 目录）。
- 不会生成 `<cwd>/.codex/prompts`。
- 测试与构建通过。
