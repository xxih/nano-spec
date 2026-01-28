# NanoSpec CI/CD 完整方案

> 版本：v1.1
> 更新日期：2026-01-28
> 维护者：xxih

## 目录

1. [概述](#概述)
2. [版本管理策略](#版本管理策略)
3. [CI/CD 流程设计](#cicd-流程设计)
4. [GitHub Actions 配置](#github-actions-配置)
5. [NPM 发布流程](#npm-发布流程)
6. [开发规范](#开发规范)
7. [故障排查](#故障排查)
8. [最佳实践](#最佳实践)

---

## 概述

### 目标

建立一套完整的 CI/CD 流程，确保：
- ✅ 代码质量（测试、覆盖率、Lint）
- ✅ 自动化构建和发布
- ✅ 多环境兼容性测试
- ✅ 规范的版本管理
- ✅ 可追溯的发布记录

### 技术栈

- **CI/CD 平台**: GitHub Actions
- **包管理**: npm
- **代码质量**: Vitest (测试) + TypeScript (类型检查)
- **覆盖率**: @vitest/coverage-v8 + Codecov
- **版本管理**: Semantic Versioning (SemVer)
- **自动化发布**: GitHub Release + npm publish

---

## 版本管理策略

### 语义化版本 (SemVer)

遵循 [Semantic Versioning 2.0.0](https://semver.org/lang/zh-CN/) 规范：

```
MAJOR.MINOR.PATCH
```

- **MAJOR (主版本号)**: 不兼容的 API 变更
- **MINOR (次版本号)**: 向下兼容的功能新增
- **PATCH (修订号)**: 向下兼容的问题修正

### 版本号规则

| 变更类型 | 版本号变化 | 示例 | 说明 |
|---------|-----------|------|------|
| 破坏性变更 | MAJOR +1 | 1.0.0 → 2.0.0 | API 不兼容、删除功能 |
| 新功能 | MINOR +1 | 1.0.0 → 1.1.0 | 新增命令、适配器、配置项 |
| Bug 修复 | PATCH +1 | 1.0.0 → 1.0.1 | 修复 bug、性能优化 |
| 文档更新 | PATCH +1 | 1.0.0 → 1.0.1 | 仅文档变更（可选） |

### 发布节奏

**建议节奏**：
- **PATCH 版本**: 每周 1-2 次（bug 修复）
- **MINOR 版本**: 每月 1 次（新功能）
- **MAJOR 版本**: 按需（重大变更）

**Hotfix 流程**：
1. 在 `main` 分支创建 hotfix 分支
2. 修复并测试
3. 合并到 `main` 并发布 PATCH 版本
4. 同时合并到 `develop` 分支

### 分支策略

```
main (生产环境)
  ↑
  │ merge
  │
develop (开发环境)
  ↑
  │ merge
  │
feature/* (功能分支)
```

**分支说明**：
- `main`: 稳定版本，可直接发布
- `develop`: 开发主分支，合并 feature 分支
- `feature/*`: 功能开发分支
- `hotfix/*`: 紧急修复分支

---

## CI/CD 流程设计

### 完整流程图

```
┌─────────────────────────────────────────────────────────────┐
│                         Push / PR                            │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                    CI Pipeline (自动触发)                     │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐          │
│  │   Test Job  │→ │  Build Job  │→ │  Lint Job   │          │
│  │  (Node 18)  │  │  (Node 20)  │  │  (TypeScript)│         │
│  └─────────────┘  └─────────────┘  └─────────────┘          │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
              ┌──────────────┐
              │  PR Review   │
              └──────────────┘
                     │
                     ▼
              ┌──────────────┐
              │  Merge to    │
              │  main/develop│
              └──────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│              CD Pipeline (手动触发)                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐          │
│  │ Version Bump│→ │  Build Dist │→ │ Publish npm │          │
│  │  (Manual)   │  │  (Auto)     │  │  (Auto)     │          │
│  └─────────────┘  └─────────────┘  └─────────────┘          │
│                     │                                        │
│                     ▼                                        │
│              ┌─────────────┐                                 │
│              │GitHub Release│                                │
│              │  (Auto)     │                                 │
│              └─────────────┘                                 │
└─────────────────────────────────────────────────────────────┘
```

### CI 阶段（自动触发）

**触发条件**：
- Push 到 `main`、`develop` 分支
- Pull Request 到 `main`、`master` 分支

**执行步骤**：
1. **Test Job**: 运行测试套件（Node.js 18.x 和 20.x）
2. **Build Job**: 编译 TypeScript 并复制静态资源
3. **Coverage Job**: 生成测试覆盖率报告并上传到 Codecov

### CD 阶段（手动触发）

**触发条件**：
- 在 GitHub 上创建 Release

**执行步骤**：
1. **Version Bump**: 更新版本号
2. **Build**: 构建生产版本
3. **Publish**: 发布到 npm
4. **Release**: 创建 GitHub Release

---

## GitHub Actions 配置

### 工作流文件

位置：`.github/workflows/ci-cd.yml`

### 完整配置

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main, master, develop]
  pull_request:
    branches: [main, master]
  release:
    types: [created]

jobs:
  # ============================================
  # 测试作业
  # ============================================
  test:
    name: Run Tests
    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [18.x, 20.x]

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test

      - name: Generate coverage
        run: npm run test:coverage

      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v4
        with:
          token: ${{ secrets.CODECOV_TOKEN }}
          files: ./coverage/lcov.info
          fail_ci_if_error: false

  # ============================================
  # 构建作业
  # ============================================
  build:
    name: Build Project
    runs-on: ubuntu-latest
    needs: test

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20.x'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build project
        run: npm run build

      - name: Upload build artifacts
        uses: actions/upload-artifact@v4
        with:
          name: dist
          path: dist/
          retention-days: 7

  # ============================================
  # 发布到 npm
  # ============================================
  publish:
    name: Publish to npm
    runs-on: ubuntu-latest
    needs: build
    if: github.event_name == 'release' && github.event.action == 'created'

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20.x'
          registry-url: 'https://registry.npmjs.org'

      - name: Install dependencies
        run: npm ci

      - name: Build project
        run: npm run build

      - name: Publish to npm
        run: npm publish --access public
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}

  # ============================================
  # 创建 GitHub Release
  # ============================================
  create-release:
    name: Create GitHub Release
    runs-on: ubuntu-latest
    needs: publish
    if: github.event_name == 'release' && github.event.action == 'created'

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Create Release Notes
        uses: actions/github-script@v7
        with:
          script: |
            const release = context.payload.release;
            console.log(`Release ${release.tag_name} created!`);
```

### Secrets 配置

在 GitHub 仓库设置中配置以下 Secrets：

| Secret 名称 | 说明 | 获取方式 |
|------------|------|---------|
| `NPM_TOKEN` | npm 发布令牌 | https://www.npmjs.com/settings/tokens |
| `CODECOV_TOKEN` | Codecov 令牌（可选） | https://codecov.io/ |

**配置步骤**：
1. 访问 GitHub 仓库
2. Settings → Secrets and variables → Actions
3. 点击 "New repository secret"
4. 输入 Name 和 Value，点击 "Add secret"

---

## NPM 发布流程

### 前置准备

#### 1. 注册 npm 账号

```bash
# 访问 https://www.npmjs.com/ 注册账号
```

#### 2. 登录 npm

```bash
npm login
# 输入用户名、密码和邮箱
```

#### 3. 生成自动化令牌

1. 访问 https://www.npmjs.com/settings/tokens
2. 点击 "Generate New Token" → "Automation"
3. 复制生成的 token
4. 配置到 GitHub Secrets 的 `NPM_TOKEN`

### 发布流程

#### 方式一：手动发布

```bash
# 1. 更新版本号
npm version patch  # 1.0.0 → 1.0.1
npm version minor  # 1.0.0 → 1.1.0
npm version major  # 1.0.0 → 2.0.0

# 2. 推送到 GitHub
git push
git push --tags

# 3. 在 GitHub 上创建 Release
# 访问仓库 → Releases → "Create a new release"
# 选择 tag，填写 Release Notes
# 创建 Release 后会自动触发 CI/CD 发布到 npm
```

#### 方式二：使用 GitHub Release 触发

```bash
# 1. 更新版本号
npm version patch

# 2. 推送到 GitHub
git push
git push --tags

# 3. 使用 GitHub CLI 创建 Release
gh release create v1.0.1 --notes "Bug fixes and improvements"
```

#### 方式三：直接发布（不推荐生产环境）

```bash
# 仅用于测试或紧急发布
npm publish
```

### 验证发布

```bash
# 查看包信息
npm view nano-spec

# 查看特定版本
npm view nano-spec@1.0.0

# 测试安装
npm install -g nano-spec@1.0.0
```

### 撤回发布（紧急情况）

⚠️ **注意**：npm 仅允许在发布后 24 小时内撤回版本。

```bash
# 撤回特定版本
npm unpublish nano-spec@1.0.0

# 撤回整个包（仅限 24 小时内）
npm unpublish nano-spec --force

# 24 小时后无法撤回，只能发布新版本修复问题
```

---

## 开发规范

### 提交规范（Conventional Commits）

遵循 [Conventional Commits](https://www.conventionalcommits.org/zh-hans/) 规范：

#### 格式

```
<type>(<scope>): <subject>

<body>

<footer>
```

#### Type 类型

| Type | 说明 | 示例 |
|------|------|------|
| `feat` | 新功能 | `feat: add support for new AI adapter` |
| `fix` | Bug 修复 | `fix: resolve template path resolution issue` |
| `docs` | 文档更新 | `docs: update README with installation guide` |
| `style` | 代码格式（不影响功能） | `style: format code with prettier` |
| `refactor` | 重构 | `refactor: simplify config loading logic` |
| `test` | 测试相关 | `test: add unit tests for config module` |
| `chore` | 构建过程或辅助工具 | `chore: update dependencies` |
| `perf` | 性能优化 | `perf: optimize file copying performance` |
| `ci` | CI/CD 相关 | `ci: add coverage report upload` |

#### 示例

```bash
# 新功能
git commit -m "feat(adapter): add support for Claude Code"

# Bug 修复
git commit -m "fix(config): resolve issue with config file loading"

# 文档更新
git commit -m "docs(readme): update installation guide"

# 重构
git commit -m "refactor(commands): simplify command initialization logic"

# 测试
git commit -m "test(adapters): add unit tests for all adapters"
```

### 代码审查清单

在提交 PR 前确保：

- [ ] 所有测试通过（`npm test`）
- [ ] 测试覆盖率达标（目标：> 70%）
- [ ] TypeScript 编译无错误（`npm run build`）
- [ ] 代码符合项目风格
- [ ] 提交信息符合 Conventional Commits 规范
- [ ] 更新了相关文档（README、CHANGELOG）
- [ ] 添加了必要的测试用例

### 本地开发流程

```bash
# 1. 克隆仓库
git clone https://github.com/xxih/nano-spec.git
cd nano-spec

# 2. 安装依赖
npm install

# 3. 创建功能分支
git checkout -b feature/my-feature

# 4. 开发并测试
npm run dev
npm test
npm run build

# 5. 提交代码
git add .
git commit -m "feat: add my feature"

# 6. 推送到 GitHub
git push origin feature/my-feature

# 7. 创建 Pull Request
# 在 GitHub 上创建 PR，等待代码审查
```

### 发布前检查清单

在发布新版本前确保：

- [ ] 所有测试通过
- [ ] 测试覆盖率达标
- [ ] 更新了 CHANGELOG.md
- [ ] 更新了 package.json 的版本号
- [ ] 本地构建成功（`npm run build`）
- [ ] 本地测试安装（`npm pack && npm install -g nano-spec-*.tgz`）
- [ ] 更新了 README.md（如有必要）
- [ ] 检查了 Breaking Changes（如有）

---

## 故障排查

### 常见问题

#### 1. CI 构建失败

**症状**：GitHub Actions 构建失败

**排查步骤**：
1. 查看 GitHub Actions 日志
2. 检查错误发生在哪个 Job（test/build/publish）
3. 本地复现问题
4. 修复并提交

**常见原因**：
- 测试失败
- TypeScript 编译错误
- 依赖安装失败
- 构建脚本错误

#### 2. npm 发布失败

**症状**：`npm publish` 失败

**错误信息**：
```
403 Forbidden
```

**排查步骤**：
1. 检查 `NPM_TOKEN` 是否正确配置
2. 检查包名是否已被占用
3. 检查是否有发布权限
4. 检查版本号是否已存在

**解决方案**：
```bash
# 重新生成 npm token
# 更新 GitHub Secrets 的 NPM_TOKEN

# 检查包名是否可用
npm view nano-spec

# 如果包名被占用，使用作用域包
# 修改 package.json:
{
  "name": "@your-username/nano-spec",
  "publishConfig": {
    "access": "public"
  }
}
```

#### 3. 测试覆盖率不达标

**症状**：覆盖率低于目标值

**排查步骤**：
1. 运行 `npm run test:coverage` 查看详细报告
2. 识别未覆盖的代码路径
3. 添加测试用例

**解决方案**：
```bash
# 查看覆盖率报告
npm run test:coverage

# 在浏览器中打开 coverage/index.html 查看详细报告
```

#### 4. 构建产物缺失

**症状**：用户安装后找不到命令或模块

**排查步骤**：
1. 检查 `package.json` 的 `files` 字段
2. 检查 `package.json` 的 `main` 和 `bin` 字段
3. 检查 `.npmignore` 是否错误地排除了必要文件

**解决方案**：
```json
// package.json
{
  "files": [
    "dist",
    "bin",
    "README.md",
    "LICENSE"
  ],
  "main": "dist/index.js",
  "bin": {
    "nanospec": "./bin/nanospec.js"
  }
}
```

#### 5. 跨平台构建失败

**症状**：Linux 环境构建失败（Windows 本地正常）

**排查步骤**：
1. 检查是否使用了平台特定的命令（如 `xcopy`）
2. 检查路径分隔符（Windows 用 `\`，Linux 用 `/`）

**解决方案**：
```javascript
// 使用 Node.js 的 path 模块处理路径
import path from 'path';
const filePath = path.join('src', 'static');

// 使用 fs-extra 进行跨平台文件操作
import fs from 'fs-extra';
fs.copySync(src, dest, { overwrite: true });
```

### 调试技巧

#### 本地模拟 CI 环境

```bash
# 使用 Docker 模拟 Linux 环境
docker run -it node:20 bash

# 在容器中运行构建
git clone <repository-url>
cd nano-spec
npm ci
npm run build
npm test
```

#### 查看 npm 发布内容

```bash
# 预览将要发布的内容
npm pack --dry-run

# 生成 tarball 并检查
npm pack
tar -tzf nano-spec-*.tgz
```

---

## 最佳实践

### 1. 版本管理

- ✅ 使用语义化版本（SemVer）
- ✅ 遵循 Conventional Commits 规范
- ✅ 每次发布前更新 CHANGELOG.md
- ✅ 使用 Git Tag 标记版本
- ✅ 不要直接修改已发布的版本

### 2. 代码质量

- ✅ 保持高测试覆盖率（目标 > 70%）
- ✅ 为新功能编写测试
- ✅ 使用 TypeScript 类型检查
- ✅ 定期更新依赖（`npm audit fix`）
- ✅ 使用 ESLint/Prettier 统一代码风格

### 3. CI/CD

- ✅ 所有代码必须通过 CI 才能合并
- ✅ 使用多版本 Node.js 测试（18.x, 20.x）
- ✅ 自动化测试覆盖率报告
- ✅ 使用 GitHub Secrets 管理敏感信息
- ✅ 定期检查 CI 日志，优化构建速度

### 4. 发布流程

- ✅ 使用 GitHub Release 触发发布
- ✅ 发布前在本地充分测试
- ✅ 编写清晰的 Release Notes
- ✅ 及时响应用户反馈
- ✅ 保留历史版本（不要 unpublish）

### 5. 文档

- ✅ 保持 README.md 更新
- ✅ 维护 CHANGELOG.md
- ✅ 为新功能添加文档
- ✅ 提供使用示例
- ✅ 响应文档相关的 Issue

### 6. 安全

- ✅ 不要在代码中硬编码敏感信息
- ✅ 使用 `.npmignore` 排除敏感文件
- ✅ 定期运行 `npm audit` 检查漏洞
- ✅ 启用 npm 2FA（双因素认证）
- ✅ 使用最小权限原则配置 Secrets

---

## 附录

### A. 常用命令速查

```bash
# 开发
npm install              # 安装依赖
npm run dev              # 开发模式
npm run build            # 构建项目
npm test                 # 运行测试
npm run test:watch       # 监听模式测试
npm run test:coverage    # 生成覆盖率报告

# 版本管理
npm version patch        # 修订号 +1
npm version minor        # 次版本号 +1
npm version major        # 主版本号 +1

# 发布
npm pack                 # 打包（不发布）
npm publish              # 发布到 npm
npm unpublish            # 撤回发布（24小时内）

# 配置
npm config set registry https://registry.npmjs.org/
npm login                # 登录 npm
npm whoami               # 查看当前用户
```

### B. 文件结构

```
nano-spec/
├── .github/
│   └── workflows/
│       └── ci-cd.yml          # CI/CD 配置
├── src/
│   ├── adapters/              # AI 工具适配器
│   ├── commands/              # CLI 命令
│   ├── config/                # 配置管理
│   ├── presets/               # 预设包
│   ├── static/                # 静态资源
│   └── index.ts               # 入口文件
├── scripts/
│   └── build.js               # 构建脚本
├── bin/
│   └── nanospec.js            # CLI 入口
├── package.json               # npm 配置
├── tsconfig.json              # TypeScript 配置
├── vitest.config.ts           # 测试配置
├── README.md                  # 项目文档
├── LICENSE                    # 许可证
├── .gitignore                 # Git 忽略规则
└── .npmignore                 # npm 发布忽略规则
```

### C. 相关链接

- [GitHub 仓库](https://github.com/xxih/nano-spec)
- [npm 包](https://www.npmjs.com/package/nano-spec)
- [Semantic Versioning](https://semver.org/lang/zh-CN/)
- [Conventional Commits](https://www.conventionalcommits.org/zh-hans/)
- [GitHub Actions 文档](https://docs.github.com/en/actions)
- [Vitest 文档](https://vitest.dev/)

### D. 更新日志

| 版本 | 日期 | 变更 |
|------|------|------|
| v1.1 | 2026-01-28 | 修复 CI/CD 构建问题，完善文档 |
| v1.0 | 2026-01-20 | 初始版本发布 |

---

## 联系方式

- **GitHub Issues**: https://github.com/xxih/nano-spec/issues
- **Email**: [待补充]

---

**文档版本**: v1.1
**最后更新**: 2026-01-28
**维护者**: xxih