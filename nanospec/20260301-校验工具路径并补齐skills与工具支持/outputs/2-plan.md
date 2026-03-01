# 方案：路径修正、Skills 补齐与 Gemini 适配

## 执行步骤

1. 适配器层改造
- 修正 `copilot` 目录到 `.github/prompts/`。
- 调整 `copilot` 文件格式为 `.prompt.md`。
- 为 `claude-code` 新增 `supportedAssets: ['commands','skills']` 与 `generateSkills`。
- 新增 `gemini` 适配器（commands only，TOML 原样输出）。

2. scope 路由统一
- 在 `init/sync` 增加适配器目标目录解析，覆盖 `codex`、`claude-code`、`gemini` 的 `project|user`。
- 保持配置键 `codex_scope` 向后兼容。

3. 测试补齐
- 更新 `copilot.test.ts`（目录与扩展名）。
- 更新 `claude-code.test.ts`（skills + scope）。
- 新增 `gemini.test.ts`。
- 更新 `index.test.ts`（注册清单、数量、格式断言）。
- 增加/更新 `init/sync` 相关断言。

4. 文档与变更
- README 更新支持工具与路径说明。
- CHANGELOG 增加本次条目（仅已完成内容）。

5. 验证
- 运行最小必要测试集。
- 运行全量 `npm test`。

## 风险与对策

- 风险：不同工具对用户级目录行为不同。
- 对策：对支持用户级目录的工具仅通过 `--scope user` 明确启用，并在测试中通过 `NANOSPEC_HOME_DIR` 注入可控路径。

- 风险：`copilot` 改为 `.prompt.md` 后与旧目录兼容性变化。
- 对策：README 明确新路径，测试覆盖文件名与目录。
