# Alignment Log

- [x] **[变更]** 当前任务范围从“跨工具安装指引 + 单 skill 合并”扩展为“统一 `nanospec` skill 的中文说明与 CLI 去前置化”。 `@2026-03-15`
  - **Resolved:** `src/static/skills/nanospec` 与 `.codex/skills/nanospec` 的 `SKILL.md`、`references/*.md` 统一改为中文说明，并明确可以在没有 `nanospec` CLI 的仓库里按约定目录结构直接运行。 `@2026-03-15`

- [x] **[缺失]** 既有 `outputs/1-spec.md`、`outputs/2-plan.md` 与 `outputs/3-tasks.md` 未覆盖任务目录结构说明、CLI-free 运行约束，以及发布态与项目副本的同步要求。 `@2026-03-15`
  - **Resolved:** 已将任务目录结构、README/CHANGELOG 同步口径、`.codex` 与 `src/static` 双副本一致性约束回写到当前任务 outputs。 `@2026-03-15`

- [x] **[偏差]** 最新实现已新增回归测试来约束中文文案与无 CLI 硬依赖，但任务追踪文件仍停留在上一轮交付状态。 `@2026-03-15`
  - **Resolved:** 已在 `outputs/3-tasks.md` 增补“中文化与 CLI 去耦”任务组，并补记验证与提交动作。 `@2026-03-15`

- [x] **[缺失]** `SKILL.md` 只把 align 作为普通阶段列出，没有强调“出现偏差时必须先 align 再继续”的优先级。 `@2026-03-15`
  - **Resolved:** 已在 `SKILL.md`、`references/align.md`、`references/run.md` 与 README 中统一强调：align 不是可选补记，发生需求变化、实现偏差或临时决策时必须先对齐再继续。 `@2026-03-15`

- [x] **[缺失]** NanoSpec 任务名缺少统一格式约束，未要求时间前缀。 `@2026-03-15`
  - **Resolved:** 已统一要求新建任务目录使用 `YYYYMMDD-任务主题` 格式，并同步更新 `SKILL.md`、`references/init.md`、`references/run.md`、`references/onboard.md` 与 README。 `@2026-03-15`
