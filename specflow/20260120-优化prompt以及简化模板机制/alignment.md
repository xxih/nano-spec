# Alignment

- [偏差] templates 目录用途理解错误 `@2026-01-20`
  - 原理解：templates/ 目录用于存放命令模板（TOML）和通用规范定制（AGENTS.md）
  - 正确理解：templates/ 目录仅用于存放**输出产物模板**（outputs/*.md），即 `1-spec.md`、`2-plan.md`、`3-tasks.md`、`acceptance.md`、`alignment.md`、`summary.md`
  - 影响：需要修正 1-spec.md 中关于 templates 目录的描述
  - ↳ [已确认] templates 仅存放输出产物模板，AGENTS.md 直接在根目录追加即可，commands 暂不支持定制 `@2026-01-20`

- [待确认] AGENTS.md 的存放位置 `@2026-01-20`
  - 问题：AGENTS.md 应该放在 `specflow/` 根目录还是 `specflow/templates/` 目录？
  - 需求说明："不需要有特定的文件夹定制 AGENTS.md 因为直接在 AGENTS.md 里面追加即可"
  - 理解：AGENTS.md 应该放在 `specflow/` 根目录，直接编辑追加内容，不需要 templates/AGENTS.md