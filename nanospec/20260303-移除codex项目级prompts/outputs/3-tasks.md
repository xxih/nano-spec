## 1. 代码改造

- [x] 1.1 修改 `src/adapters/codex.ts`：commands 固定 user scope，project scope 自动回退并提示。
- [x] 1.2 调整配置默认值：`src/config/config.ts` 与 `src/commands/config.ts` 的 `codex_scope` 默认改为 `user`。

验收条件：codex commands 不再写入项目级 `.codex/prompts`。

## 2. 测试补齐

- [x] 2.1 更新 `src/adapters/codex.test.ts`，区分 workspace/home，验证 project scope 不写项目目录。
- [x] 2.2 更新 `src/commands/sync.test.ts`，新增 codex+project scope 写用户目录回归测试。
- [x] 2.3 更新 `src/commands/init.test.ts`，注入 `NANOSPEC_HOME_DIR`，避免写真实 home 导致权限问题。

验收条件：相关单测覆盖新行为并稳定通过。

## 3. 文档与验证

- [x] 3.1 更新 `README.md`：codex commands 改为用户级固定路径说明。
- [x] 3.2 更新 `CHANGELOG.md` 的 Unreleased 记录。
- [x] 3.3 运行 `npm test`。
- [x] 3.4 运行 `npm run build`。

验收条件：文档与实现一致，测试和构建通过。
