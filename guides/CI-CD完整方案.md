# NanoSpec CI/CD 完整方案（当前生效）

本文件是当前唯一权威的发布流程说明，已与 `.github/workflows/release.yml` 对齐。

## 1. 当前发布机制

- 发布触发方式：推送 Git tag（`v*`）到远端。
- 发布执行位置：GitHub Actions（不是本地）。
- 发布命令：workflow 内执行 `npm publish --provenance`（按 tag 自动选择 `alpha`/`beta`/`rc` 渠道）。
- 凭据：使用 `NPM_TOKEN`（`secrets.NPM_TOKEN`）。

## 2. workflow 真实行为（release.yml）

- `push` 任意分支：执行 `check`（`npm ci` + `npm test`）。
- `pull_request` 到 `main`：执行 `check`。
- `push` tag `v*`：先执行 `check`，通过后执行 `publish`。
- `publish` job 会：
  - `npm ci`
  - `npm run build`
  - `npm publish --provenance --access public`（或 prerelease tag）
  - 创建 GitHub Release

## 3. 维护者发版步骤（标准操作）

1. 更新版本与变更记录
- 修改 `package.json` / `package-lock.json` 版本号（例如 `1.1.1`）。
- 更新 `CHANGELOG.md`，仅记录已完成功能。
- 未完成需求（例如 ralph）不得写入 changelog。

2. 本地发布前校验
- `npm test`
- `npm run build`
- `npm pack --dry-run`
- 检查 tarball 文件列表，确认没有 `ralph` 相关文件进入发布包。

3. 提交与打 tag
- `git add ...`
- `git commit -m "chore(release): 1.1.1"`
- `git tag v1.1.1`
- `git push origin main`
- `git push origin v1.1.1`

4. 观察 CI/CD
- 打开 GitHub Actions，确认 `CI/CD Pipeline` 成功。
- 检查 npm 包页面版本是否更新。

## 4. Prerelease 规则

- tag 包含 `alpha`：发布到 `alpha` 渠道。
- tag 包含 `beta`：发布到 `beta` 渠道。
- tag 包含 `rc`：发布到 `rc` 渠道。
- 其他 `v*` tag：发布到默认 `latest` 渠道。

## 5. 常见错误与处理

- 错误：手动执行 `npm publish`
- 处理：停止本地发布，改为打 tag 触发 CI/CD。

- 错误：changelog 包含未完成功能
- 处理：发版前从 changelog 移除未完成条目。

- 错误：tarball 出现不应发布内容
- 处理：修复构建和打包规则后重新校验，再打新 tag。
