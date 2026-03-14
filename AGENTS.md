# AGENTS（项目级全局 Prompt）

## 1. 通用约束

1. 每次写新功能，都要写单测，并同步更新 `README.md`。
2. `src` 中的文档禁止直接命名为 `AGENTS.md`（会被 AI 自动识别）。
3. 每次改动后都要检查 `CHANGELOG.md` 是否需要更新。
4. 若使用 NanoSpec 任务目录，`outputs/3-tasks.md` 只记录交付动作与状态，不记录 commit hash、提交信息或补日志类 git 元信息。

## 2. 发布流程约束（必须遵守）

1. 默认使用 CI/CD 发布，禁止直接手动 `npm publish`。
2. 本仓库发布以 tag 触发：推送 `v*` tag 后由 `.github/workflows/release.yml` 自动发布。
3. 发版前必须完成校验：
   - `npm test`
   - `npm run build`
   - `npm pack --dry-run`
4. 必须检查发布包内容，确保不包含未完成功能相关文件（当前重点：`ralph`）。
5. `CHANGELOG.md` 只能写已完成、已交付内容；未完成需求不得写入发布记录。

## 3. AI 执行发布任务 SOP

1. 先读取并遵循 `guides/CI-CD完整方案.md`。
2. 更新版本号（`package.json`、`package-lock.json`）与 `CHANGELOG.md`。
3. 执行发布前校验并确认 tarball 内容正确。
4. 提交并打 tag：`vX.Y.Z`。
5. 推送 `main` 和对应 tag，等待 GitHub Actions 发布。
6. 失败时先修复问题，再用新版本号重新打 tag，不覆盖已发布版本。

## 4. 提交节奏

### 4.1 默认规则（必须遵守）

1. 只要本轮存在有效文件改动，且已完成最小必要验证，在给出“任务完成”答复前至少完成 1 次 commit。
2. 若未提交，必须在回复中明确原因（如：用户明确要求不提交、验证失败、存在阻塞）。
3. 禁止把无关改动混入同一 commit；必要时拆分为多个小步 commit。

### 4.2 质量建议

1. 小步提交：一个 commit 一个主要意图。
2. 提交前尽量运行与改动路径直接相关的最小测试。
3. 提交信息建议使用 `type(scope): summary`，例如 `feat(cli): add alias for switch command`。
4. 避免把无关改动混入同一 commit。

### 4.3 仍需遵守

1. 未经明确要求，不执行 push、`rebase --interactive`、或改写已共享历史。
2. 不做空洞或无意义 commit。
