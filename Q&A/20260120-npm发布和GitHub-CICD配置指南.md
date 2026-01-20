# 如何将 nano-spec 包发布到 npm 并配置 GitHub CI/CD

## 问题
告诉我，怎么将这个包发布到 npm 上，给我一个完整教程指南。以及后续怎么接 GitHub 的 cicd

## 回答

### 核心答案

将 `nano-spec` 包发布到 npm 并配置 GitHub CI/CD 需要完成以下主要步骤：
1. 准备 npm 账号和包配置
2. 修复 `.gitignore` 配置（关键问题）
3. 配置 `package.json` 的发布字段
4. 执行发布流程
5. 配置 GitHub Actions 实现自动化 CI/CD

---

## 第一部分：npm 发布完整教程

### 1. 前置准备

#### 1.1 注册 npm 账号
```bash
# 访问 https://www.npmjs.com/ 注册账号
# 或使用 CLI 注册
npm adduser
```

#### 1.2 登录 npm
```bash
npm login
# 输入用户名、密码和邮箱
```

#### 1.3 验证登录状态
```bash
npm whoami
# 应该显示你的用户名
```

### 2. 修复关键配置问题

**⚠️ 重要发现：当前 `.gitignore` 配置存在问题**

查看 `.gitignore:53`，发现 `dist` 目录被忽略了：
```gitignore
# Nuxt.js build / generate output
.nuxt
dist
```

**问题分析：**
- `dist` 目录包含了 TypeScript 编译后的 JavaScript 代码（`package.json:4` 的 `main` 字段指向 `dist/index.js`）
- 如果 `dist` 不发布到 npm，用户安装包后将无法使用
- 这是 npm 包发布的常见错误

**解决方案：**

在 `.gitignore` 中添加 `!dist/` 来排除 dist 目录，或者使用 `.npmignore` 文件：

**方案 A：修改 `.gitignore`（推荐）**
```gitignore
# Nuxt.js build / generate output
.nuxt
# dist  # 注释掉这一行或删除
```

**方案 B：创建 `.npmignore` 文件（更灵活）**
创建 `.npmignore` 文件，明确指定哪些文件不发布：
```
# 源代码和开发文件
src/
*.ts
tsconfig.json
vitest.config.ts

# 测试和覆盖率
*.test.ts
coverage/
.nyc_output

# 开发工具
.vscode/
.idea/
*.code-workspace

# 文档和示例
Q&A/
my-test-folder/

# Git 相关
.git/
.gitignore

# 其他
*.log
.env
```

这样 `.gitignore` 中的 `dist` 仍然对 Git 生效，但 npm 发布时会包含 `dist` 目录。

### 3. 完善 `package.json` 配置

当前 `package.json` 需要补充以下字段：

```json
{
  "name": "nano-spec",
  "version": "1.0.0",
  "description": "A minimal extendable Spec-Driven framework. Not just for code -- for writing, research, and anything you want to get done.",
  "type": "module",
  "main": "dist/index.js",
  "bin": {
    "specflow": "./bin/specflow.js"
  },
  "files": [
    "dist",
    "bin",
    "README.md",
    "LICENSE"
  ],
  "scripts": {
    "build": "tsc && xcopy /E /I /Y src\\templates dist\\templates",
    "dev": "tsx src/index.ts",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage",
    "prepublishOnly": "npm run build",
    "prepack": "npm run build"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/xxih/spec-flow.git"
  },
  "keywords": [
    "spec-driven",
    "workflow",
    "cli",
    "ai-tools",
    "cursor",
    "qwen",
    "iflow",
    "cline"
  ],
  "author": "xxih",
  "license": "MIT",
  "bugs": {
    "url": "https://github.com/xxih/spec-flow/issues"
  },
  "homepage": "https://github.com/xxih/spec-flow#readme",
  "engines": {
    "node": ">=18"
  },
  "publishConfig": {
    "access": "public"
  }
}
```

**新增字段说明：**
- `files`: 明确指定要发布的文件/目录
- `repository`: 仓库地址
- `keywords`: 关键词，便于搜索
- `author`: 作者信息
- `bugs`: 问题反馈地址
- `homepage`: 项目主页
- `publishConfig.access`: 设置为 public（因为包名 `nano-spec` 没有作用域前缀）
- `prepublishOnly`: 发布前自动构建
- `prepack`: 打包前自动构建

### 4. 准备发布内容

#### 4.1 添加 LICENSE 文件
```bash
# 创建 MIT License 文件
echo "MIT License

Copyright (c) 2026 xxih

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE." > LICENSE
```

#### 4.2 检查构建产物
```bash
# 构建项目
npm run build

# 检查 dist 目录
dir dist

# 预览将要发布的包
npm pack --dry-run
```

### 5. 检查包名是否可用

```bash
# 检查包名是否已被占用
npm view nano-spec

# 如果返回 404，说明包名可用
# 如果返回信息，说明包名已被占用，需要改用其他名称或使用作用域包
```

**如果包名已被占用，可以使用作用域包：**
```json
{
  "name": "@your-username/nano-spec",
  "publishConfig": {
    "access": "public"
  }
}
```

### 6. 发布流程

#### 6.1 测试发布（推荐）
```bash
# 使用 npm test 命名空间测试
npm pack

# 这会生成 nano-spec-1.0.0.tgz 文件
# 可以解压检查内容是否正确
```

#### 6.2 正式发布
```bash
# 发布到 npm
npm publish

# 如果是第一次发布作用域包
npm publish --access public
```

#### 6.3 验证发布
```bash
# 访问 https://www.npmjs.com/package/nano-spec
# 或使用命令查看
npm view nano-spec
```

### 7. 版本更新和重新发布

```bash
# 更新版本号（自动更新 package.json 和 git tag）
npm version patch  # 1.0.0 -> 1.0.1
npm version minor  # 1.0.0 -> 1.1.0
npm version major  # 1.0.0 -> 2.0.0

# 重新发布
npm publish
```

---

## 第二部分：GitHub CI/CD 配置

### 1. 创建 GitHub Actions 工作流

在 `.github/workflows/` 目录下创建 `ci-cd.yml` 文件：

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [ main, master, develop ]
  pull_request:
    branches: [ main, master ]
  release:
    types: [ created ]

jobs:
  # 测试作业
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

  # 构建作业
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

  # 发布到 npm
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

  # 创建 GitHub Release
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

### 2. 配置 GitHub Secrets

在 GitHub 仓库设置中添加以下 Secrets：

1. **NPM_TOKEN**（必需）
   - 访问 https://www.npmjs.com/settings/tokens
   - 点击 "Generate New Token" -> "Automation"
   - 复制生成的 token
   - 在 GitHub 仓库中：Settings -> Secrets and variables -> Actions -> New repository secret
   - Name: `NPM_TOKEN`
   - Value: 粘贴 token

2. **CODECOV_TOKEN**（可选，用于代码覆盖率）
   - 访问 https://codecov.io/
   - 连接 GitHub 仓库
   - 获取 token
   - 添加到 GitHub Secrets

### 3. 语义化版本控制（可选但推荐）

#### 3.1 安装 semantic-release
```bash
npm install --save-dev semantic-release @semantic-release/git @semantic-release/changelog @semantic-release/npm
```

#### 3.2 创建 `.releaserc` 配置文件
```json
{
  "branches": ["main", "master"],
  "plugins": [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    "@semantic-release/changelog",
    [
      "@semantic-release/npm",
      {
        "npmPublish": true
      }
    ],
    [
      "@semantic-release/git",
      {
        "assets": ["package.json", "CHANGELOG.md"],
        "message": "chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}"
      }
    ],
    [
      "@semantic-release/github",
      {
        "assets": [
          {
            "path": "nano-spec-*.tgz"
          }
        ]
      }
    ]
  ]
}
```

#### 3.3 更新 CI/CD 工作流以使用 semantic-release
```yaml
# 在 publish job 中替换为：
  publish:
    name: Publish to npm
    runs-on: ubuntu-latest
    needs: test

    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        with:
          persist-credentials: false

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20.x'
          registry-url: 'https://registry.npmjs.org'

      - name: Install dependencies
        run: npm ci

      - name: Build project
        run: npm run build

      - name: Run semantic-release
        run: npx semantic-release
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

### 4. 提交规范（用于 semantic-release）

使用 Conventional Commits 规范：
- `feat:` 新功能
- `fix:` 修复 bug
- `docs:` 文档更新
- `style:` 代码格式（不影响功能）
- `refactor:` 重构
- `test:` 测试相关
- `chore:` 构建过程或辅助工具的变动

示例：
```bash
git commit -m "feat: add support for new AI adapter"
git commit -m "fix: resolve template path resolution issue"
git commit -m "docs: update README with installation guide"
```

### 5. 完整的 CI/CD 流程图

```
Push/PR → [Test Job] → [Build Job] → (如果是 Release) → [Publish Job] → [Create Release]
            ↓              ↓
         Run Tests      Build dist/
         (Node 18,20)   Upload artifacts
```

---

## 第三部分：完整操作步骤总结

### 1. 首次发布步骤

```bash
# 1. 修复 .gitignore 或创建 .npmignore
# 2. 更新 package.json（添加 files、repository 等字段）
# 3. 创建 LICENSE 文件
# 4. 构建项目
npm run build

# 5. 预览发布内容
npm pack --dry-run

# 6. 登录 npm
npm login

# 7. 发布
npm publish --access public

# 8. 验证
npm view nano-spec
```

### 2. 配置 GitHub CI/CD 步骤

```bash
# 1. 创建 .github/workflows/ci-cd.yml
# 2. 配置 GitHub Secrets（NPM_TOKEN）
# 3. 提交并推送
git add .github/workflows/
git commit -m "ci: add GitHub Actions CI/CD pipeline"
git push

# 4. 验证 CI/CD 是否正常运行
# 访问 GitHub 仓库的 Actions 标签页
```

### 3. 后续发布流程（使用 CI/CD）

```bash
# 方式 A：手动创建 Release
# 1. 更新代码
git add .
git commit -m "feat: add new feature"

# 2. 推送代码
git push

# 3. 在 GitHub 上创建 Release（会自动触发发布）

# 方式 B：使用 semantic-release（自动化）
# 1. 遵循 Conventional Commits 规范提交
git commit -m "feat: add new feature"
git push

# 2. CI 会自动分析提交并发布新版本
```

---

## 详细分析

### 代码引用

- `package.json:4` - `main` 字段指定了入口文件为 `dist/index.js`
- `package.json:6-8` - `bin` 字段定义了 CLI 命令
- `package.json:13` - `build` 脚本使用 `tsc` 编译 TypeScript 并复制模板文件
- `.gitignore:53` - `dist` 目录被忽略，这是发布的关键问题
- `tsconfig.json:6-7` - TypeScript 配置输出目录为 `dist`
- `src/index.ts:1-21` - CLI 入口文件，使用 commander 定义命令
- `bin/specflow.js:1-2` - CLI 脚本入口，引用编译后的代码

### 相关文件

- `package.json` - npm 包配置文件
- `.gitignore` - Git 忽略规则（需要修改）
- `tsconfig.json` - TypeScript 编译配置
- `src/index.ts` - 主要源代码
- `bin/specflow.js` - CLI 入口脚本
- `README.md` - 项目文档

### 关键设计决策

1. **使用 TypeScript 开发** - 需要编译步骤，因此 `dist` 目录必须发布
2. **ESM 模块** - `package.json:3` 的 `"type": "module"` 表明使用 ESM
3. **Node.js >= 18** - `package.json:38-40` 指定了最低 Node 版本
4. **多 AI 工具适配** - 支持 cursor、qwen、iflow、cline 等工具

### 补充说明

#### 1. 包名冲突问题

如果 `nano-spec` 包名已被占用，有以下选择：
- 使用作用域包：`@your-username/nano-spec`
- 修改包名：`nano-spec-cli`、`@your-username/nano-spec-cli` 等
- 联系原包所有者协商转让

#### 2. 版本策略

建议遵循语义化版本（SemVer）：
- `MAJOR.MINOR.PATCH`
- 破坏性变更：增加主版本号
- 新功能：增加次版本号
- Bug 修复：增加修订号

#### 3. 测试建议

在发布前确保：
- 所有测试通过：`npm test`
- 测试覆盖率达标：`npm run test:coverage`
- 本地构建成功：`npm run build`
- CLI 功能正常：`npm link && specflow --help`

#### 4. 文档维护

- 保持 `README.md` 更新
- 考虑添加 `CHANGELOG.md` 记录版本变更
- 提供 API 文档（如果适用）

#### 5. 安全考虑

- 不要在代码中硬编码敏感信息
- 使用 `.npmignore` 排除测试文件和开发工具
- 定期更新依赖：`npm audit fix`
- 启用 npm 2FA（双因素认证）

---

## 常见问题

### Q1: 发布时提示 "403 Forbidden"
**A:** 检查以下几点：
- npm token 是否正确配置
- 包名是否已被占用
- 是否有发布权限

### Q2: 用户安装后找不到命令
**A:** 确保：
- `package.json` 中 `bin` 字段正确
- `bin/specflow.js` 文件存在且有正确的 shebang
- `package.json` 中 `files` 字段包含 `bin` 目录

### Q3: CI/CD 失败
**A:** 检查：
- GitHub Actions 日志
- Secrets 是否正确配置
- 构建脚本是否在所有 Node 版本下都能运行

### Q4: 如何撤回已发布的版本？
**A:**
```bash
# 撤回特定版本（24小时内）
npm unpublish nano-spec@1.0.0

# 撤回整个包（仅限24小时内）
npm unpublish nano-spec --force

# 24小时后无法撤回，只能发布新版本修复问题
```

---

## 分析时间
2026-01-20 16:30:00