# 规格说明：统一 Skill + 安装指引对齐

## 背景

用户反馈两点：
1. README 不需要讲“怎么做 skill”，只需要告诉用户“怎么安装 skill”；
2. 现有技能拆分过细，需要合并为一个 skill，并通过渐进披露索引不同阶段能力。

本轮实现又出现两项新增口径：
3. 内置 `nanospec` skill 的发布态与项目态副本都需要统一为中文说明；
4. skill 工作流不能再把 `nanospec` CLI 当成前置依赖，而要支持按目录结构直接运行。

本轮对齐再补充两项口径：
5. `align` 需要被强调为偏差处理的优先入口，而不是可选补记；
6. 新建 NanoSpec 任务目录名必须带时间前缀。

本轮继续补充一项定位调整：
7. `nanospec` skill 的第一定位应是 AI 工作中间文档目录规范与 `align` 纠偏机制，可无缝配合其他 skill；完整 spec-driven workflow 改为按需路由能力。

## 需求

1. 将项目内多个 NanoSpec skill 合并为一个 `nanospec` skill。
2. 合并后的 skill 使用渐进披露：
   - `SKILL.md` 仅保留核心流程与索引；
   - 分阶段细节放在 `references/*.md`，按需加载。
3. README 仅保留安装说明（简版）：
   - 先给出自然语言触发示例（让 agent 帮用户安装）。
   - `nanospec sync --adapter codex --assets skills --scope user`
   - `$skill-installer install https://github.com/xxih/nano-spec/tree/main/src/static/skills/nanospec`
4. 保持 `src/static/skills` 与项目 `.codex/skills` 结构一致，避免分发路径不一致。
5. 移除 README 中“暂不支持原生 skills 时的 MCP/CLI 转接”描述。
6. `src/static/skills/nanospec` 与 `.codex/skills/nanospec` 中的 `SKILL.md`、`references/*.md` 统一改为中文说明，并补充任务目录结构。
7. `SKILL.md` 与 `references/init.md`、`references/run.md`、`references/onboard.md` 需要明确：
   - 不依赖 `nanospec` CLI；
   - 可以直接创建或维护 `nanospec/<task-name>/` 目录；
   - `.nanospec/.current` 只是任务指针，不是技能生效前提。
8. README 与 CHANGELOG 需要同步说明中文化、任务目录结构和 CLI-free 运行口径。
9. 增加回归测试，保证：
   - 发布态 skill 与项目内 `.codex` 副本保持一致；
   - skill 文档不会回退到英文标题；
   - 不会重新引入 `nanospec new`、`nanospec init`、`nanospec --version` 等 CLI 硬依赖描述。
10. `SKILL.md`、`references/align.md`、`references/run.md` 与 README 需要明确：出现需求变化、实现偏差或临时决策时，必须先执行 align，再继续 spec / plan / execute。
11. 新建任务目录名必须使用 `YYYYMMDD-任务主题` 格式，例如 `20260315-skills跨工具安装指南`；相关规则要同步到 `SKILL.md`、`references/init.md`、`references/run.md`、`references/onboard.md` 与 README。
12. `SKILL.md` 与 README 需要明确：
   - `nanospec` 默认提供目录规范，而不是强制从 init 开始跑完整流程；
   - 当其他 skill 采用“先 plan 后 xxx”时，只要装载了 `nanospec`，就应按该目录规范读写中间文档；
   - `align` 是跨 skill 的核心纠偏入口，不依赖完整 workflow 才能使用；
   - 完整 spec-driven workflow 保留，但改为按需路由。
13. `SKILL.md` 需要参考 `_AGENTS.md` 补充一章 “Align 机制”，明确：
   - align 是贯穿所有阶段的问题发现与变更传播机制，不限于 `/align` 命令；
   - 口径变化时必须同步更新受影响 outputs，并把动作回写到 `outputs/3-tasks.md`。
14. `SKILL.md` 与 README 需要明确：使用本 skill 时，可以直接通过 `/xxx` 将请求路由到对应阶段；若外部工具仍使用 `/spec.align`、`/spec.2-plan` 等前缀命令，也保持兼容。
15. skill 目录需要补充 `scripts/create-task-skeleton.sh`，用于创建任务骨架：
   - 支持输入主题名并自动补上当天 `YYYYMMDD-` 前缀；
   - 支持输入已带日期前缀的任务目录名；
   - 创建 `brief.md`、`alignment.md`、`assets/`、`outputs/1-spec.md`、`outputs/2-plan.md`、`outputs/3-tasks.md`；
   - 支持通过 `--set-current` 更新 `.nanospec/.current`。
16. 任务骨架脚本应优先采用更兼容的实现，避免过度依赖 shell 方言；优先选用只依赖标准库的 `python3` 脚本。
17. `references/*.md` 需要尽可能与原 `src/static/commands/spec.*.toml` 保持一致：
   - 保留输入、执行流程、规则、输出约束、关键判断逻辑；
   - 允许做 skill 化改写，但不能把原有能力压缩成只有 3 到 5 行的过度简化版本。
18. `outputs/3-tasks.md` 只记录交付动作与状态，不记录 commit hash、提交信息或“补任务日志”之类的 git 元信息。

## 验收标准

- `src/static/skills/` 下仅保留 `nanospec` 一个内置 skill。
- `.codex/skills/` 与之对齐为单 skill 结构。
- README 安装指引聚焦可执行命令，无“如何创作 skill”的教程内容。
- `src/static/skills/nanospec` 与 `.codex/skills/nanospec` 的 `SKILL.md`、`references/*.md` 内容保持一致，且采用中文说明。
- `nanospec` skill 能在没有 CLI 的仓库里按约定目录结构运行，不把 CLI 命令当作前置步骤。
- 存在自动化回归测试覆盖双副本同步、中文标题与无 CLI 硬依赖约束。
- skill 文档与 README 明确要求：出现偏差或变更时，先 align 再继续其他阶段。
- 新建任务目录名统一为 `YYYYMMDD-任务主题` 格式。
- `nanospec` skill 文档明确区分“目录规范层”和“按需路由的完整 workflow”，且支持与其他 skill 共用同一任务容器。
- `SKILL.md` 明确说明 align 机制与 `/xxx` 路由方式，且相关文案有测试锁定。
- skill 自带可执行脚本来创建任务骨架，且发布副本与项目副本保持一致并有自动化测试覆盖。
- skill 的脚本实现兼容性提升，且 references 与原 commands 的能力边界重新对齐。
- 任务清单不再承载 git 元信息，因此任务完成后不会再为了回写 commit hash 额外制造一次提交。
