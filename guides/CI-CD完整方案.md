这是一个为你量身定制的 **“人机协作 + OIDC 安全发布”** 完整方案。

这套方案的核心特点是：**你完全掌控 Changelog 的内容质量，而繁琐的构建、认证和发布流程由 CI 自动化完成。**

---

# NanoSpec CI/CD 完整方案 (v2.0 Final)

## 1. 核心流程概览

| 步骤        | 执行者           | 动作            | 说明                                       |
| ----------- | ---------------- | --------------- | ------------------------------------------ |
| **1. 准备** | **开发者**       | 生成差异日志    | 使用脚本一键复制 git log                   |
| **2. 撰写** | **AI + 人**      | 编写 Changelog  | AI 生成草稿，人工润色，填入 `CHANGELOG.md` |
| **3. 封板** | **开发者**       | `npm version`   | 自动修改版本号、提交代码、打 Tag           |
| **4. 触发** | **开发者**       | `git push`      | 推送代码和 Tag 到 GitHub                   |
| **5. 发布** | **CI (Actions)** | 自动构建 & 发布 | **免 Token (OIDC)** 自动发包到 npm         |

---

## 2. 前置准备 (只需做一次)

### 2.1 配置 npm Trusted Publishing (OIDC)

这是目前最安全的发布方式，**不需要**在 GitHub Secrets 里存 `NPM_TOKEN`。

1. 登录 [npm 官网](https://www.npmjs.com/)。
2. 进入你的包设置页面 (**Settings**)。
3. 点击 **Publishing** 选项卡。
4. 在 **GitHub Actions** 区域点击 **Connect**。
5. 输入你的 GitHub 仓库信息（如 `xxih/nano-spec`），选择 **General Access** 或者指定 workflow 文件名（推荐指定 `release.yml`）。

---

## 3. 日常发版操作指南 (你的工作)

当你准备发布新版本时，按以下顺序操作：

**步骤 1：获取素材**

**步骤 2：AI 辅助写作**

**步骤 3：更新文件**

**步骤 4：本地封板**

```bash
# 这会自动修改 package.json, 提交 git, 并打上 tag
npm version patch  # 或者 minor, major

```

**步骤 5：触发发布**

```bash
git push --follow-tags

```

_(操作结束，剩下的交给 CI)_

---

## 4. GitHub Actions 完整配置 (CI 的工作)

创建文件 `.github/workflows/release.yml`。

这个配置包含两个核心 Job：

1. **Check**: 代码质量检查（测试）。
2. **Publish**: 构建并发布到 npm（仅当测试通过时）。

```yaml
name: Release to npm

# 触发规则：只有推送到 main 分支 且 是 tag (v*) 时触发
on:
  push:
    tags:
      - 'v*'

# 权限配置：OIDC 发布必须项
permissions:
  contents: write # 允许读取代码，且允许创建 GitHub Release
  id-token: write # 允许与 npm 进行 OIDC 认证

jobs:
  # 第一阶段：质量检查
  check:
    name: Quality Check
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install Dependencies
        run: npm ci

      # 运行测试，确保不发布坏包
      - name: Run Tests
        run: npm test

  # 第二阶段：构建与发布
  publish:
    name: Build & Publish
    needs: check # 必须等 check 成功才执行
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          registry-url: 'https://registry.npmjs.org'

      - name: Install Dependencies
        run: npm ci

      - name: Build
        run: npm run build

      # 核心：发布到 npm
      # --provenance: 启用来源证明 (显示在 npm 页面)
      # --access public: 确保是公开包
      # 注意：这里不需要设置 NPM_TOKEN，因为配置了 id-token: write 和 npm OIDC
      - name: Publish to npm
        run: npm publish --provenance --access public

      # 可选：同步创建 GitHub Release 页面
      - name: Create GitHub Release
        uses: softprops/action-gh-release@v1
        with:
          # 直接使用 tag 名称作为 Release 标题
          name: Release ${{ github.ref_name }}
          # 自动勾选 "Set as the latest release"
          make_latest: true
          # 自动生成 Release Notes (基于 tag message 或 commit log)
          generate_release_notes: true
```

---

## 5. 方案亮点总结

1. **绝对掌控权**：版本号什么时候升、Changelog 写什么，全由你在本地决定，不会出现机器人乱发版的情况。
2. **零 Token 维护**：利用 OIDC 机制，你再也不用担心 `NPM_TOKEN` 过期，或者不小心把 Token 泄露给协作者。
3. **安全兜底**：`needs: check` 确保了只有通过测试的代码才会被发布。
4. **来源可信**：`--provenance` 参数会让你的包在 npm 官网上显示 "Provenance" 绿色盾牌，证明该包是由 GitHub Actions 原生构建的，提升用户信任度。

现在，你只需要把上面的 YAML 复制进项目，去 npm 官网点两下鼠标配置 OIDC，就可以开始享受丝滑的发版体验了！
