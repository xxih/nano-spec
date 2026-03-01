# Alignment Log

- [x] **[变更]** 任务范围从“仅修正 Codex 项目目录”扩展为“同时支持 `commands` 与 `skills` 两类资产”。 `@2026-03-01`
  - **Resolved:** 本任务后续实现统一资产模型，CLI 与适配器都按 `commands | skills | both` 语义设计。 `@2026-03-01`

- [x] **[变更]** Codex 目标目录不再只看项目级 `.codex/prompts/`，需新增用户级 `~/.codex/prompts/`。 `@2026-03-01`
  - **Resolved:** 采用 `scope=user|project`，并在 `init/sync/config` 暴露可配置入口。 `@2026-03-01`

- [x] **[缺失]** 既有 `outputs/1-spec.md` 与 `outputs/2-plan.md` 未覆盖 skills 模板来源、落盘规则和同步行为。 `@2026-03-01`
  - **Resolved:** 已同步更新 `outputs/1-spec.md`、`outputs/2-plan.md`，并将后续动作落地到 `outputs/3-tasks.md`。 `@2026-03-01`
