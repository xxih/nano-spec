# 方案：单 Skill 重构 + README 安装简化

## 实施方案

1. 新建统一 skill 目录 `nanospec/`，在 `SKILL.md` 中保留：
   - 核心 workflow；
   - 渐进披露索引（指向 `references/*.md`）。
2. 将原先分散能力迁移到 references 文件（init/run/spec/align/plan/execute/accept/summary/onboard）。
3. 删除旧的多 skill 目录，更新相关单测到单 skill 口径。
4. README 只保留安装路径与命令，不再介绍 skill 创作流程。
   - GitHub 安装路径固定指向 `src/static/skills/nanospec`。
   - 增加自然语言安装示例，移除 MCP/CLI 转接说明。
5. CHANGELOG 记录“单 skill 合并 + 安装说明简化”。

## 风险与约束

- 保持 `SKILL.md` frontmatter 极简：仅 `name` 与 `description`。
- references 内容需要一层索引可达，避免深层跳转。
