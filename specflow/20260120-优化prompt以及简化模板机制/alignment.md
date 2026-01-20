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

- [偏差] Cursor 适配器格式转换错误 `@2026-01-21`
  - 问题：原 cursor.ts 适配器简单地将 TOML 内容写入 .md 文件，导致格式不匹配
  - 原因：缺少 TOML 解析和格式转换逻辑
  - 影响：生成的 Cursor 命令文件格式错误，无法正常使用
  - 优化方案：
    1. 新增 `parseTomlCommand` 函数解析 TOML 格式的命令文件
    2. 更新 `getCommandTemplate` 函数，优先从内置的 `.iflow/commands/` 读取模板
    3. 修改 cursor.ts 的 `transformCommand` 方法，将 TOML 转换为 Cursor 支持的 Markdown 格式（YAML frontmatter + prompt）
  - ↳ [已确认] 已优化所有适配器（cursor, cline, qwen, iflow）的格式转换逻辑 `@2026-01-21`

- [优化] 模板机制重构 `@2026-01-21`
  - 原机制：依赖外部模板文件，优先级复杂
  - 新机制：
    1. 内联模板：核心 prompt 直接内联到 `.iflow/commands/*.toml` 文件中
    2. 可选定制：支持在 `specflow/templates/` 下定制输出产物模板（1-spec.md, 2-plan.md 等）
    3. 智能转换：每个适配器根据目标 AI 工具的格式要求进行转换
  - 影响：
    - init.ts 更新：使用内置模板源，简化初始化流程
    - utils.ts 更新：优化模板获取逻辑，优先级为 内置 > 项目定制
    - 所有适配器更新：统一使用 `parseTomlCommand` 解析 TOML 格式
  - ↳ [已确认] 模板机制已重构完成，支持灵活定制 `@2026-01-21`

- [优化] Prompt 同步更新 `@2026-01-21`
  - 变更：用户修改了 `assets/核心prompt/flow.2-plan.md`，新增了 "Decision Protocol" 部分
  - 内容：添加了针对不同任务类型（Coding Task vs Content/Writing Task）的判断逻辑
  - 影响：需要同步更新到内置的 `.iflow/commands/flow.2-plan.toml`
  - ↳ [已确认] 已同步更新 flow.2-plan.toml，添加 Decision Protocol 部分 `@2026-01-21`