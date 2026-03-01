# AGENTS（项目级全局 Prompt）

## 1. 通用约束

1. 每次写新功能，都要写单测，并同步更新 `README.md`。
2. `src` 中的文档禁止直接命名为 `AGENTS.md`（会被 AI 自动识别）。
3. 每次改动后都要检查 `CHANGELOG.md` 是否需要更新。

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

## 4. 多 Agent / 多 Worktree / 多分支协作 SOP

1. 启用条件（按需，不强制）：

- 默认单 Agent 开发即可。
- 只有在你明确要求“并行多 Agent”时，才启用本节流程。

2. 协作基本原则：

- 一个 Agent 只在一个独立 worktree 工作。
- 一个 worktree 只对应一个分支，禁止多个 Agent 共用同一 worktree。
- 非 owner Agent 不直接修改他人负责文件；确需修改先同步负责人。

3. 命名规范（必须带时间戳，避免冲突）：

- 时间戳格式：`YYYY-MMDD-HHmm`，例如 `2026-0301-1909`。
- 分支：`<type>/<task>-<agent>-<ts>`
  - 示例：`feat/release-sop-codex-a-2026-0301-1909`
- worktree：`../wt-<task>-<agent>-<ts>`
  - 示例：`../wt-release-sop-codex-a-2026-0301-1909`
- `type` 推荐：`feat` / `fix` / `docs` / `chore`。

4. 标准启动流程（每个 Agent）：

```bash
git fetch origin
git worktree add ../wt-<task>-<agent>-<ts> -b <type>/<task>-<agent>-<ts> origin/main
cd ../wt-<task>-<agent>-<ts>
```

PowerShell 生成时间戳：

```powershell
$ts = Get-Date -Format "yyyy-MMdd-HHmm"
```

5. 开发与提交流程：

- 先确认任务边界（目标、文件范围、验收标准）再动手。
- 变更保持小步提交（一个 commit 一个意图）。
- 新功能必须补单测；影响用户行为时同步更新 `README.md`。
- 完成后检查 `CHANGELOG.md` 的 `Unreleased` 是否需要更新。
- 提交前执行最小必要测试（至少覆盖变更路径）。

6. 并行协作同步策略：

- 每次开始前执行 `git fetch origin`。
- 长任务周期性 `git rebase origin/main`，降低后期冲突成本。
- 有依赖关系时，先合并上游分支，再处理下游分支。
- 集成由主 Agent/维护者执行，其他 Agent 通过 PR 提交。

7. PR 要求：

- 必须包含：变更摘要、影响范围、测试结果、风险说明。
- 必须关联任务/Issue，便于追踪并行任务状态。
- 冲突解决后重新跑相关测试再请求评审。

8. 收尾清理：

```bash
git branch -d <type>/<task>-<agent>-<ts>
git worktree remove ../wt-<task>-<agent>-<ts>
```

- 仅在确认分支已合并且 worktree 无在途任务时执行。

## 5. 强制提交节奏（默认开启）

在执行任务时必须保持“可回滚、可审查”的提交节奏。除非用户明确要求“先不要 commit”，否则必须主动提交，不得等用户催促。

### 5.1 提交触发条件（满足任一即必须 commit）

1. 完成一个独立子任务并通过最小必要验证（测试/构建/静态检查）。
2. 完成一个跨文件闭环改动（代码 + 测试或文档）。
3. 进入高风险改动前，先提交稳定基线。
4. 长任务连续开发 30~60 分钟且已有稳定中间结果。
5. 准备给出“任务完成”答复前，如存在稳定且相关的未提交改动。

### 5.2 提交质量要求

1. 小步提交：一个 commit 只做一个意图。
2. 提交前验证：至少运行与改动路径直接相关的最小测试；测试未过不得标记完成。
3. 提交信息：使用 `type(scope): summary`，例如 `feat(cli): add alias for switch command`。
4. 若改动很多，必须给出合理切分并分批提交，不得将无关改动混入同一 commit。

### 5.3 回复时强制披露

每轮回复必须同步说明：

1. 本轮是否已 commit。
2. commit hash 与覆盖范围。
3. 已运行的验证命令与结果。

若因权限/策略无法 commit，必须明确说明阻塞原因，并给出可执行的 commit 切分方案。

### 5.4 禁止事项

1. 禁止把无关改动混在一个 commit。
2. 禁止为了“凑次数”提交空洞或无意义 commit。
3. 未经明确要求，禁止 push、`rebase --interactive`、或改写已共享历史。
