# 规格说明：统一 Skill + 简化安装指引

## 背景

用户反馈两点：
1. README 不需要讲“怎么做 skill”，只需要告诉用户“怎么安装 skill”；
2. 现有技能拆分过细，需要合并为一个 skill，并通过渐进披露索引不同阶段能力。

## 需求

1. 将项目内多个 NanoSpec skill 合并为一个 `nanospec` skill。
2. 合并后的 skill 使用渐进披露：
   - `SKILL.md` 仅保留核心流程与索引；
   - 分阶段细节放在 `references/*.md`，按需加载。
3. README 仅保留安装说明（简版）：
   - `nanospec sync --adapter codex --assets skills --scope user`
   - `$skill-installer install <github-subdir-url>`
4. 保持 `src/static/skills` 与项目 `.codex/skills` 结构一致，避免分发路径不一致。

## 验收标准

- `src/static/skills/` 下仅保留 `nanospec` 一个内置 skill。
- `.codex/skills/` 与之对齐为单 skill 结构。
- README 安装指引聚焦可执行命令，无“如何创作 skill”的教程内容。
