# 方案：单 Skill 对齐 + README 安装简化

## 实施方案

1. 新建统一 skill 目录 `nanospec/`，在 `SKILL.md` 中保留：
   - 核心 workflow；
   - 渐进披露索引（指向 `references/*.md`）。
2. 将原先分散能力迁移到 references 文件（init/run/spec/align/plan/execute/accept/summary/onboard）。
3. 删除旧的多 skill 目录，更新相关单测到单 skill 口径。
4. README 只保留安装路径与命令，不再介绍 skill 创作流程。
   - GitHub 安装路径固定指向 `src/static/skills/nanospec`。
   - 增加自然语言安装示例，移除 MCP/CLI 转接说明。
5. 将 `src/static/skills/nanospec` 与 `.codex/skills/nanospec` 的 `SKILL.md`、`references/*.md` 全量同步为中文说明。
6. 调整 `SKILL.md`、`references/init.md`、`references/run.md`、`references/onboard.md`：
   - 显式写明“可脱离 CLI 运行”；
   - 补充最小任务目录结构；
   - 把 `.nanospec/.current` 降级为可选任务指针。
7. README 与 CHANGELOG 同步记录“中文化 + CLI-free + 任务结构说明”。
8. 新增回归测试，约束：
   - 发布态 skill 与 `.codex` 副本逐文件一致；
   - 不重新出现英文章节标题；
   - init/run/onboard 不重新引入 CLI 硬依赖文案。
9. 在 `SKILL.md`、`references/align.md`、`references/run.md` 与 README 中强化 align 优先级，明确偏差出现时必须先对齐、再继续后续阶段。
10. 在 `SKILL.md`、`references/init.md`、`references/run.md`、`references/onboard.md` 与 README 中统一新建任务命名规则：`YYYYMMDD-任务主题`。

## 风险与约束

- 保持 `SKILL.md` frontmatter 极简：仅 `name` 与 `description`。
- references 内容需要一层索引可达，避免深层跳转。
- README 可以补充必要背景，但不能回退成“如何创作 skill”的教程。
- `.codex/skills/nanospec` 与 `src/static/skills/nanospec` 必须同步更新，避免发布态与项目态口径漂移。
- 任务命名规则必须只约束“新建任务”，不能破坏对用户显式指定既有目录的复用能力。
