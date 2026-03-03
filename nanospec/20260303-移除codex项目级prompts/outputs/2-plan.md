# 方案：强制 codex commands 走用户级目录

## 设计决策

1. 在 `src/adapters/codex.ts` 内部统一归一化 commands scope 为 `user`。
2. 仅在输入 `project` 时输出提示，避免静默偏差。
3. 不修改 codex skills 的目录解析逻辑。
4. 将配置默认值 `codex_scope` 调整为 `user`，使默认行为与事实一致。

## 执行步骤

1. 修改 codex adapter 的 commands 路径解析与生成逻辑。
2. 更新 `codex`、`sync`、`init` 相关测试，确保在测试环境不会写入真实 home。
3. 更新 README 的路径矩阵与 FAQ 说明。
4. 更新 CHANGELOG 的 Unreleased 记录。
5. 运行 `npm test` 与 `npm run build` 验证。
