# 规格说明：Skills 跨工具安装指引

## 背景

用户希望 nano-spec 的 skills 可以被更多 AI agent 工具方便安装/使用。
当前 README 只覆盖了本地同步与部分适配器信息，缺少跨工具分发与安装的统一指引。

## 需求

1. 在 README 增加“Skills 安装（跨工具）”章节。
2. 章节需覆盖：
   - Agent Skills 开放标准最小结构（`SKILL.md` + frontmatter）。
   - GitHub 仓库分发结构示例（`skills/<skill-name>/...`）。
   - Codex 使用 `skill-installer` 的安装命令示例。
   - 非原生 skills 工具的兜底方案（MCP/CLI 转接）。
3. 指引以可执行命令为主，减少概念化描述。

## 验收标准

- README 中存在独立章节，可直接复制命令完成安装。
- 指引覆盖 Codex 与“其它工具”两类路径。
- 文档与仓库当前技能结构不冲突。
