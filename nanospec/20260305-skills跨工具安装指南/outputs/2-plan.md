# 方案：README 增补跨工具 Skills 安装说明

## 实施方案

1. 在 README 的 skills 相关章节后新增“Skills 安装（跨工具）”。
2. 采用“标准 -> 分发 -> 安装 -> 兜底”的固定顺序组织内容：
   - 标准：最小目录与 frontmatter 要求。
   - 分发：推荐 GitHub 目录布局。
   - Codex 安装：`$skill-installer install <url>`。
   - 其他工具：clone 后加入 skills 搜索路径，或用 MCP/CLI 转接。
3. 在 CHANGELOG 的 Unreleased 记录文档增强项。

## 风险与约束

- 不承诺“所有工具原生支持”，仅给出兼容性最强的实践路径。
- 保持 frontmatter 极简，避免不同实现的可选字段差异导致兼容问题。
