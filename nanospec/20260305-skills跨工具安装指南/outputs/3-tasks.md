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
