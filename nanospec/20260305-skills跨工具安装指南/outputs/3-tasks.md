## 1. 任务建档

- [x] 1.1 创建任务目录并写入 `brief.md`。
- [x] 1.2 产出 `outputs/1-spec.md`。
- [x] 1.3 产出 `outputs/2-plan.md`。

验收条件：任务目标、规格、方案可追踪。

## 2. Skill 合并重构

- [x] 2.1 新建统一 `nanospec` skill，并采用 `SKILL.md + references/` 渐进披露结构。
- [x] 2.2 删除旧的多 skill 目录，统一为单 skill。
- [x] 2.3 更新相关测试断言（skill 名称/复制/同步路径）。

验收条件：仓库技能结构已合并为单 skill，测试通过。

## 3. README 与发布记录

- [x] 3.1 README 改为“安装导向”说明，不再展开 skill 创作教程。
- [x] 3.2 更新 `CHANGELOG.md`（Unreleased）。
- [x] 3.3 运行最小必要验证命令。
- [x] 3.4 完成一次有效 commit。
- [x] 3.5 按反馈调整 README：安装路径指向 `src/static/skills/nanospec`、增加自然语言安装示例、删除 MCP/CLI 转接说明。
- [x] 3.6 按反馈调整 README：自然语言安装示例必须包含可点击的 GitHub 来源链接。

验收条件：变更可审查、可回滚。

## 4. static skill 文件修复

- [x] 4.1 修复 `src/static/skills/nanospec/SKILL.md` 的 frontmatter：为 `description` 增加引号，避免 YAML 解析失败。
- [x] 4.2 增加回归测试，校验 `nanospec` skill frontmatter 中 `description` 为 YAML-safe 引号字符串。

验收条件：`src/static/skills/nanospec/SKILL.md` 可被 Codex/通用 YAML 解析器稳定加载。

## 5. skill 中文化与 CLI 去耦

- [x] 5.1 将 `src/static/skills/nanospec` 与 `.codex/skills/nanospec` 的 `SKILL.md`、`references/*.md` 统一改为中文说明，并补充最小任务目录结构。
- [x] 5.2 调整 init/run/onboard 口径，明确 skill 可脱离 `nanospec` CLI 运行，`.nanospec/.current` 仅作为可选任务指针。
- [x] 5.3 更新 `README.md` 与 `CHANGELOG.md`，同步中文化、CLI-free 与目录结构口径。
- [x] 5.4 增加回归测试，校验发布态与项目副本同步、中文标题约束，以及无 CLI 硬依赖描述。
- [x] 5.5 运行本轮最小必要验证命令：`npm test`（受既有 `src/ralph/prd.test.ts` 时间戳断言失败影响）、`npm test -- src/static/skills/nanospec/skill-content.test.ts`、`npm run build`。
- [x] 5.6 完成本轮有效 commit：`528b114 docs(skills): localize nanospec workflow guidance`。

验收条件：skill 文案、README、CHANGELOG 和测试口径保持一致，且任务状态可追踪。

## 6. align 优先级与任务命名约束

- [x] 6.1 强化 `SKILL.md`、`references/align.md` 与 `references/run.md`：出现需求变化、实现偏差或临时决策时，必须先执行 align，再继续其他阶段。
- [x] 6.2 为新建 NanoSpec 任务统一命名规则：目录名必须使用 `YYYYMMDD-任务主题` 格式，并同步到 `SKILL.md`、`references/init.md`、`references/run.md` 与 `references/onboard.md`。
- [x] 6.3 更新 `README.md` 与 `CHANGELOG.md`，同步 align 优先级和任务命名格式。
- [x] 6.4 扩充回归测试，覆盖 align 优先级文案和 `YYYYMMDD-任务主题` 约束。
- [x] 6.5 运行本轮最小必要验证命令：`npm test -- src/static/skills/nanospec/skill-content.test.ts`、`npm run build`。
- [x] 6.6 完成本轮有效 commit：`41b8367 docs(skills): require align-first task updates`。

验收条件：skill 主文档、参考稿、README 与测试对 align 和任务命名的口径一致。

## 7. skill 定位重构为目录规范优先

- [x] 7.1 回写当前任务对齐记录：将 `nanospec` skill 新定位记入 `alignment.md`，并补记本轮“先修改仓库、后补记录”的流程偏差。
- [x] 7.2 更新 `SKILL.md`：把第一定位改为“AI 工作中间文档目录规范 + align 核心能力”，并补充跨 skill 协作边界。
- [x] 7.3 更新 `references/align.md` 与 `README.md`，明确 `align` 可服务于其他 `plan / research / execute` skill，完整 workflow 为按需路由。
- [x] 7.4 更新回归测试，锁定“目录规范优先、完整 workflow 按需路由”的文案。
- [x] 7.5 运行本轮最小必要验证命令：`npm test -- src/static/skills/nanospec/skill-content.test.ts`。
- [x] 7.6 完成本轮有效 commit：`8723dcd docs(nanospec): reposition skill around directory convention`。

验收条件：本轮 skill 定位调整在 NanoSpec 任务记录、仓库文档与测试中都可追踪，且流程偏差已被显式记录。

## 8. align 机制说明与 slash 路由

- [x] 8.1 在当前任务 `alignment.md` 记录本轮新增要求：`SKILL.md` 需补充 align 机制说明，并明确 `/xxx` 路由方式。
- [x] 8.2 更新 `SKILL.md`：新增“Align 机制”章节，参考 `_AGENTS.md` 解释触发时机、标签格式、变更传播与任务回写要求。
- [x] 8.3 更新 `SKILL.md` 与 `README.md`：明确使用本 skill 时可通过 `/xxx` 路由到对应阶段，同时兼容 `/spec.align`、`/spec.2-plan` 等前缀命令。
- [x] 8.4 更新 `CHANGELOG.md` 与回归测试，锁定 “align 机制 + `/xxx` 路由” 文案。
- [x] 8.5 运行本轮最小必要验证命令：`npm test -- src/static/skills/nanospec/skill-content.test.ts`。
- [x] 8.6 完成本轮有效 commit：`6e9941b docs(nanospec): explain align mechanism routing`。

验收条件：`SKILL.md` 已具备独立的 align 机制说明与 slash 路由说明，发布副本、项目副本、README、CHANGELOG、测试和任务记录保持一致。

## 9. 任务骨架脚本

- [x] 9.1 在当前任务 `alignment.md` 记录新增需求：为 skill 补充创建任务骨架的脚本。
- [x] 9.2 在发布副本和项目副本新增 `scripts/create-task-skeleton.sh`，用于创建标准任务骨架，并支持 `--set-current`。
- [x] 9.3 更新 `SKILL.md`、`references/init.md` 与 `references/run.md`，明确优先使用脚本创建骨架。
- [x] 9.4 更新 `README.md` 与 `CHANGELOG.md`，记录脚本能力。
- [x] 9.5 增加自动化测试：覆盖脚本副本同步和实际骨架创建行为。
- [x] 9.6 运行本轮最小必要验证命令：`npm test -- src/static/skills/nanospec/skill-content.test.ts src/static/skills/nanospec/create-task-skeleton.test.ts`。
- [x] 9.7 完成本轮有效 commit：`97fe993 feat(nanospec): add task skeleton script`。

验收条件：skill 目录内可直接使用脚本创建符合规范的任务骨架，且文档、测试、发布副本与项目副本口径一致。

## 10. 脚本兼容性与 references 对齐

- [x] 10.1 在当前任务 `alignment.md` 记录新增要求：脚本实现要更兼容，references 要尽量贴近原 commands。
- [x] 10.2 将任务骨架脚本切换为 `python3 scripts/create_task_skeleton.py`，并同步更新 `SKILL.md`、README、CHANGELOG 与测试。
- [x] 10.3 重写 `references/*.md`，补回输入、执行流程、输出约束、关键判断与规则，使其更接近原 `spec.*.toml` 命令模板。
- [x] 10.4 运行本轮最小必要验证命令：`npm test -- src/static/skills/nanospec/skill-content.test.ts src/static/skills/nanospec/create-task-skeleton.test.ts`。
- [ ] 10.5 完成本轮有效 commit。

验收条件：脚本实现更兼容，references 不再过度简化，并与原有 command 模板保持能力一致性。
