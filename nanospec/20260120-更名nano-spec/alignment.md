# Alignment

- [偏差] AGENTS.md 不应该放在根目录，会被 AI 约定俗成读取 @2026-01-21
  - ↳ [已确认] 将 AGENTS.md 重命名为 _AGENTS.md，放在 src/static/ 目录
  - ↳ [已确认] 更新 package.json 的 build 脚本，在构建时复制 _AGENTS.md 到 dist/ 和根目录
  - ↳ [已确认] 更新 init.ts 中的查找逻辑，从 dist/_AGENTS.md 读取
  - ↳ [已确认] 从 package.json 的 files 字段中移除 AGENTS.md
  - ↳ [已确认] 删除根目录的 AGENTS.md 文件
  - ↳ [已确认] 构建和测试均通过 @2026-01-21

- [冲突] README.md 编码问题导致中文乱码 @2026-01-20
  - ↳ [已确认] 需要使用 PowerShell 的 -replace 修复编码问题，统一使用 UTF-8 编码
  - ↳ [已确认] 重新编辑 README.md 解决中文显示问题
  - ↳ [已确认] Node.js 编译过程中的字符编码问题已解决 @2026-01-20

- [缺失] npm 发布所需的配置文件 @2026-01-20
  - ↳ [已确认] 创建 `.npmignore` 文件解决 `dist` 目录发布问题
  - ↳ [已确认] 完善 `package.json` 添加 `files`、`repository`、`keywords`、`author`、`license`、`bugs`、`homepage`、`publishConfig` 等字段
  - ↳ [已确认] 创建 `LICENSE` 文件（MIT License）
  - ↳ [已确认] 创建 `.github/workflows/ci-cd.yml` GitHub Actions CI/CD 配置
  - ↳ [已确认] 添加 `prepublishOnly` 和 `prepack` 脚本自动构建

- [偏差] 发现旧的命令模板文件残留 @2026-01-20
  - ↳ [已确认] `dist/templates/commands/flow.*.toml` 文件是旧版本遗留的，使用 `flow` 前缀
  - ↳ [已确认] `src/templates/commands/` 目录已在之前的优化中被删除（commands 不支持定制）
  - ↳ [已确认] 删除 `dist/templates/commands/` 目录，避免发布旧文件
  - ↳ [已确认] 主要的命令文件在 `.iflow/commands/` 目录下，使用正确的 `spec.*` 前缀

- [歧义] `xcopy /E /I /Y src\templates dist\templates` 命令的必要性 @2026-01-20
  - ↳ [已确认] `xcopy` 命令是**必要的**，用于将输出产物模板复制到 `dist/templates/`
  - ↳ [已确认] `src/templates/outputs/` 下有 5 个文件：2-plan.md, 3-tasks.md, acceptance.md, alignment.md, summary.md
  - ↳ [已确认] 这些文件会被 `init.ts` 复制到用户项目的 `nanospec/templates/` 目录，供用户定制输出格式
  - ↳ [已确认] `src/templates/outputs/1-spec.md` 不存在，这是正确的（`1-spec.md` 是可选的定制模板）
  - ↳ [已确认] `init.ts` 中的 `copyFile` 函数会在文件不存在时跳过，不会报错
  - ↳ [已确认] `dist/templates/outputs/1-spec.md` 是旧的构建产物残留，已删除
  - ↳ [已确认] `spec.1-spec.toml` 中的 prompt 已经包含了默认的输出格式，`1-spec.md` 模板是可选的
  - ↳ [已确认] 从 `init.ts` 和 `init.test.ts` 中移除了对 `1-spec.md` 的引用
  - ↳ [已确认] 更新日志输出，从"6 个输出模板"改为"5 个输出模板"
  - ↳ [已确认] **设计变更**：为了简化默认体验，init 时不再复制输出模板文件
  - ↳ [已确认] 所有命令的 `.toml` 文件中都已内联默认输出格式
  - ↳ [已确认] 移除 `src/templates/` 目录和 `xcopy` 命令
  - ↳ [已确认] 更新 `package.json` 的 build 脚本：`"build": "tsc"`
  - ↳ [已确认] 用户如需定制输出格式，可自行在 `nanospec/templates/` 创建对应文件
  - ↳ [已确认] 将 `AGENTS.md` 从 `nanospec/AGENTS.md` 复制到项目根目录 `AGENTS.md`
  - ↳ [已确认] 更新 `init.ts` 中的 `AGENTS.md` 查找逻辑，直接从项目根目录查找
  - ↳ [已确认] 更新 `package.json` 的 `files` 字段，添加 `AGENTS.md` 和 `.iflow` 目录
  - ↳ [已确认] 最终包大小 20.6 kB，44 个文件
  - ↳ [已确认] 所有测试通过（44个测试）

- [待确认] GitHub Secrets 配置 @2026-01-20
  - 需要在 GitHub 仓库中配置 `NPM_TOKEN`（用于自动发布到 npm）
  - 可选配置 `CODECOV_TOKEN`（用于代码覆盖率上传）

- [待确认] 首次发布流程 @2026-01-20
  - 检查包名 `nano-spec` 是否可用
  - 登录 npm：`npm login`
  - 构建并预览：`npm run build && npm pack --dry-run`
  - 发布：`npm publish --access public`
