# 如何发布 nano-spec 的 beta 版本

## 问题
我想要发 beta 版要怎么做？

## 回答

### 核心答案

发布 nano-spec 的 beta 版本有两种方式：

1. **本地手动发布**（快速测试）- 使用 `npm publish --tag beta`
2. **CI/CD 自动发布**（推荐）- 通过 GitHub Actions 自动发布 beta 版本

项目已配置完整的 CI/CD 流程（`.github/workflows/release.yml`），支持通过标签触发自动发布。

---

## 详细分析

### 一、项目发布配置概览

#### 1. package.json 发布相关配置

```json
{
  "name": "nano-spec",
  "version": "1.0.0",
  "scripts": {
    "build": "node scripts/build.js",
    "prepublishOnly": "npm run build",
    "prepack": "npm run build"
  },
  "publishConfig": {
    "access": "public"
  }
}
```

- `prepublishOnly`: 发布前自动执行构建
- `prepack`: 打包前自动执行构建
- `publishConfig.access`: 设置为 public，允许公开发布

#### 2. CI/CD 工作流配置

`.github/workflows/release.yml:1-56` 定义了完整的发布流程：

```yaml
name: CI/CD Pipeline

on:
  push:
    branches:
      - '**'      # 监听所有分支的 push（用于跑测试）
    tags:
      - 'v*'      # 监听 v 开头的标签（用于触发发布）

permissions:
  contents: write
  id-token: write  # OIDC 认证所需权限

jobs:
  check:
    name: Quality Check
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm test

  publish:
    name: Build & Publish
    needs: check      # 依赖 check 任务通过
    runs-on: ubuntu-latest
    if: startsWith(github.ref, 'refs/tags/')  # 只有 tag 推送才执行
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          registry-url: 'https://registry.npmjs.org'
      - run: npm ci
      - run: npm run build
      - run: npm publish --provenance --access public
      - uses: softprops/action-gh-release@v1
        with:
          name: Release ${{ github.ref_name }}
          make_latest: true
          generate_release_notes: true
```

**关键设计：**
- 使用 **OIDC 认证**（`id-token: write`），无需手动配置 NPM_TOKEN
- 发布前必须通过测试（`needs: check`）
- 只有打 tag 时才触发发布（`if: startsWith(github.ref, 'refs/tags/')`）
- 自动创建 GitHub Release

---

### 二、方式一：本地手动发布 Beta 版本

适用于快速测试，不经过 CI/CD。

#### 步骤 1：更新版本号

```bash
# 更新为 beta 版本（例如：1.0.0 -> 1.1.0-beta.0）
npm version 1.1.0-beta.0

# 或者使用 preid 参数
npm version prerelease --preid=beta
```

#### 步骤 2：构建项目

```bash
npm run build
```

#### 步骤 3：发布到 npm（带 beta 标签）

```bash
# 使用 --tag beta 发布为 beta 版本
npm publish --tag beta

# 如果配置了 OIDC，可能需要先登录
npm login
```

#### 步骤 4：验证发布

```bash
# 查看 beta 版本
npm view nano-spec versions --json

# 安装 beta 版本测试
npm install nano-spec@beta
```

---

### 三、方式二：CI/CD 自动发布 Beta 版本（推荐）

利用已有的 CI/CD 配置，通过标签触发自动发布。

#### 步骤 1：创建 beta 版本标签

```bash
# 更新 package.json 版本号为 beta
npm version 1.1.0-beta.0 --no-git-tag-version

# 提交更改
git add package.json
git commit -m "chore: bump version to 1.1.0-beta.0"

# 创建 beta 标签（注意：标签名以 v 开头）
git tag v1.1.0-beta.0

# 推送代码和标签
git push origin main
git push origin v1.1.0-beta.0
```

#### 步骤 2：CI/CD 自动执行

推送标签后，GitHub Actions 会自动：

1. **Check 阶段**：运行测试（`npm test`）
2. **Publish 阶段**：
   - 构建项目（`npm run build`）
   - 发布到 npm（`npm publish --provenance --access public`）
   - 创建 GitHub Release

#### 步骤 3：在 npm 上标记为 beta

**注意：** 当前 CI/CD 配置默认发布为 `latest` 标签。要发布为 beta，需要修改工作流。

##### 修改方案：支持根据标签自动判断发布通道

修改 `.github/workflows/release.yml`：

```yaml
- name: Publish to npm
  run: |
    if [[ "${{ github.ref_name }}" == *"beta"* ]] || [[ "${{ github.ref_name }}" == *"alpha"* ]] || [[ "${{ github.ref_name }}" == *"rc"* ]]; then
      npm publish --tag beta --provenance --access public
    else
      npm publish --provenance --access public
    fi
  shell: bash
```

这样，当标签包含 `beta`、`alpha` 或 `rc` 时，会自动发布到 beta 通道。

---

### 四、Beta 版本管理最佳实践

#### 1. 版本号命名规范

遵循语义化版本（SemVer）+ 预发布标识：

```
主版本号.次版本号.修订号-预发布标识.预发布版本号

示例：
- 1.1.0-beta.0    # 第一个 beta 版本
- 1.1.0-beta.1    # 第二个 beta 版本
- 1.1.0-rc.0      # 发布候选版本
- 2.0.0-alpha.0   # 大版本 alpha 测试
```

#### 2. 发布流程图

```
开发完成 → 本地测试 → 更新版本号 → 创建 beta 标签 → 推送 → CI/CD 自动发布
                ↓
         发现问题 → 修复 → 更新 beta 版本号 → 重新发布
```

#### 3. 用户安装 beta 版本

```bash
# 安装最新 beta 版本
npm install nano-spec@beta

# 安装特定 beta 版本
npm install nano-spec@1.1.0-beta.0

# 查看所有可用版本
npm view nano-spec versions --json
```

#### 4. 从 beta 升级到正式版

```bash
# 当 beta 测试完成，发布正式版
npm version 1.1.0
git tag v1.1.0
git push origin main
git push origin v1.1.0

# 用户升级
npm install nano-spec@latest
```

---

### 五、前置条件检查

发布前请确保：

1. **npm 账号已配置 OIDC**
   - 访问 https://www.npmjs.com/settings/
   - 进入 "Packages & GitHub Actions"
   - 连接 GitHub 仓库 `xxih/nano-spec`

2. **本地环境就绪**
   ```bash
   npm login                    # 登录 npm
   npm whoami                   # 验证登录状态
   npm run build               # 确保构建成功
   npm test                    # 确保测试通过
   npm pack --dry-run          # 预览发布内容
   ```

3. **Git 工作区干净**
   ```bash
   git status                  # 确保没有未提交的更改
   git pull origin main        # 确保代码最新
   ```

---

### 六、常见问题

#### Q1: 发布时提示 "403 Forbidden"

**原因：**
- npm 账号未配置 OIDC
- 包名已被占用
- 版本号已存在

**解决：**
```bash
# 检查 npm 登录状态
npm whoami

# 检查版本是否已存在
npm view nano-spec versions

# 如果是 OIDC 问题，去 npm 官网配置 Trusted Publishing
```

#### Q2: CI/CD 发布失败

**检查点：**
1. 标签是否正确推送：`git tag -l`
2. 测试是否通过：`npm test`
3. 构建是否成功：`npm run build`
4. 查看 GitHub Actions 日志

#### Q3: 如何撤回 beta 版本？

```bash
# 72 小时内可以撤回
npm unpublish nano-spec@1.1.0-beta.0

# 或者标记为弃用
npm deprecate nano-spec@1.1.0-beta.0 "This beta version is deprecated, please use @latest"
```

#### Q4: beta 版本和 latest 版本的关系

- `npm install nano-spec` → 安装 `latest` 标签的版本
- `npm install nano-spec@beta` → 安装 `beta` 标签的版本
- 两者可以共存，互不影响
- 正式发布后，beta 版本不会自动变成 latest

---

## 代码引用

- `package.json:1-10` - 包基础配置和发布脚本
- `package.json:38-40` - publishConfig 配置
- `.github/workflows/release.yml:1-10` - CI/CD 触发条件和权限配置
- `.github/workflows/release.yml:13-26` - Check 任务（质量检查）
- `.github/workflows/release.yml:28-56` - Publish 任务（构建和发布）
- `.github/workflows/release.yml:45` - npm publish 命令
- `docs/20260120-npm发布和GitHub-CICD配置指南.md` - 详细发布指南文档
- `docs/CI-CD完整方案.md` - CI/CD 完整方案文档

## 相关文件

- `package.json` - npm 包配置
- `.github/workflows/release.yml` - CI/CD 工作流配置
- `docs/20260120-npm发布和GitHub-CICD配置指南.md` - npm 发布详细指南
- `docs/CI-CD完整方案.md` - CI/CD 方案文档
- `scripts/build.js` - 构建脚本

## 补充说明

### 项目特点

1. **OIDC 安全发布**：项目使用 OIDC（OpenID Connect）进行 npm 认证，无需在 GitHub Secrets 中存储 NPM_TOKEN，更加安全
2. **自动化测试**：每次 push 都会自动运行测试，确保代码质量
3. **来源证明**：使用 `--provenance` 参数，在 npm 页面显示构建来源，增强用户信任

### 推荐的 beta 发布流程

对于 nano-spec 项目，推荐以下 beta 发布流程：

```bash
# 1. 确保代码已提交并推送
git add .
git commit -m "feat: xxx feature for beta"
git push origin main

# 2. 更新为 beta 版本
npm version 1.1.0-beta.0

# 3. 推送标签触发 CI/CD
git push origin v1.1.0-beta.0

# 4. 等待 CI/CD 完成，检查 npm 和 GitHub Release
```

### 注意事项

1. **版本号管理**：beta 版本使用独立的版本号序列，不要和正式版混淆
2. **CHANGELOG**：建议在发布 beta 版本时更新 CHANGELOG，记录变更内容
3. **测试覆盖**：beta 版本也应该有足够的测试覆盖，避免发布有问题的版本
4. **文档更新**：如果 beta 版本有新功能，提前更新文档，方便用户测试

---

## 分析时间
2026-02-11 21:50:00
