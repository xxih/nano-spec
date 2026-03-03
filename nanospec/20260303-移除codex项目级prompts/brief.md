# 移除 codex 项目级 prompts

项目级 `.codex/prompts` 在 Codex 中不生效，必须统一写到 `~/.codex/prompts`。

目标：
1. 去除 `codex` commands 的 project scope 行为（`--scope project` 不再写项目目录）。
2. 保留其他 scoped 资产能力（如 codex skills、claude-code、gemini）。
3. 补齐单测、README、CHANGELOG，确保行为和文档一致。
