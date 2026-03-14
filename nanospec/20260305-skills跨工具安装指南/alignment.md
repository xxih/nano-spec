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

- [x] **[变更]** `nanospec` skill 的定位从“默认承载完整 workflow”调整为“默认提供中间文档目录规范与跨 skill 的 align 纠偏能力，完整 spec-driven workflow 改为按需路由”。 `@2026-03-15`
  - **Resolved:** 已更新 `SKILL.md`、`references/align.md`、README 与测试断言，明确 `nanospec` 可以独立作为目录规范层，与其他 `plan / research / execute` skill 协同；完整 workflow 仍保留，但不再作为默认前提。 `@2026-03-15`

- [x] **[偏差]** 本轮定位调整先完成了仓库文档与测试修改，之后才补写 NanoSpec 任务记录，违反了“变更先 align 回写”的流程约束。 `@2026-03-15`
  - **Resolved:** 已回写当前任务的 `alignment.md`、`outputs/1-spec.md`、`outputs/2-plan.md` 与 `outputs/3-tasks.md`，补齐本轮变更、验证与提交信息。 `@2026-03-15`

- [x] **[变更]** `nanospec` skill 需要在 `SKILL.md` 中单列说明 align 机制，并明确 skill 使用时可通过 `/xxx` 将请求路由到对应阶段。 `@2026-03-15`
  - **Resolved:** 已参考 `_AGENTS.md` 的通用规则，在 `SKILL.md` 中新增“Align 机制”和“路由方式”章节，并同步 README、CHANGELOG 与测试断言。 `@2026-03-15`

- [x] **[变更]** `nanospec` skill 需要内置一个创建任务骨架的脚本，避免每次 init/run 都重复手工建目录。 `@2026-03-15`
  - **Resolved:** 已新增 `scripts/create-task-skeleton.sh` 到发布副本与项目副本，并更新 `SKILL.md`、`references/init.md`、`references/run.md`、README、CHANGELOG 与测试。 `@2026-03-15`

- [x] **[变更]** 用户要求把任务骨架脚本改为更兼容的实现，并让 `references/*.md` 尽可能贴近 NanoSpec 原有 commands，而不是过度简化。 `@2026-03-15`
  - **Resolved:** 已将骨架脚本切换为 `scripts/create_task_skeleton.py`，并重写 `references/*.md` 的目标、输入、执行流程、输出约束与规则，使其更接近 `src/static/commands/spec.*.toml` 的原始能力边界。 `@2026-03-15`

- [x] **[变更]** 用户要求停止把 commit hash 写入 `outputs/3-tasks.md`，并删除现有任务中的相关条目，避免以后为了回写 git 元信息再额外提交一次。 `@2026-03-15`
  - **Resolved:** 已删除当前任务中所有 commit/hash/补任务日志相关 task 项，并在 `SKILL.md`、`references/execute.md`、`references/summary.md` 与 CHANGELOG 中明确：`3-tasks.md` 只记录交付动作与状态，不记录 git 元信息。 `@2026-03-15`

- [x] **[变更]** 用户要求整理项目级 `AGENTS.md`，发新版本，并同步升级 `~/.codex` 下的 `nanospec` skill。 `@2026-03-15`
  - **Resolved:** 已整理 `AGENTS.md` 结构、准备 `1.3.5` 发布记录，并将在本地校验通过后打 tag、推送和同步 `~/.codex/skills/nanospec`。 `@2026-03-15`
