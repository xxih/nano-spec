## 1. 核心配置文件重命名

- [x] 1.1 重命名 `.iflow/commands/flow.1-spec.toml` → `spec.1-spec.toml`
- [x] 1.2 重命名 `.iflow/commands/flow.2-plan.toml` → `spec.2-plan.toml`
- [x] 1.3 重命名 `.iflow/commands/flow.3-execute.toml` → `spec.3-execute.toml`
- [x] 1.4 重命名 `.iflow/commands/flow.accept.toml` → `spec.accept.toml`
- [x] 1.5 重命名 `.iflow/commands/flow.align.toml` → `spec.align.toml`
- [x] 1.6 重命名 `.iflow/commands/flow.summary.toml` → `spec.summary.toml`
- [x] 1.7 更新 `spec.1-spec.toml` 文件内的 `# Command: flow.1-spec` → `# Command: spec.1-spec`
- [x] 1.8 更新 `spec.2-plan.toml` 文件内的 `# Command: flow.2-plan` → `# Command: spec.2-plan`
- [x] 1.9 更新 `spec.3-execute.toml` 文件内的 `# Command: flow.3-execute` → `# Command: spec.3-execute`
- [x] 1.10 更新 `spec.accept.toml` 文件内的 `# Command: flow.accept` → `# Command: spec.accept`
- [x] 1.11 更新 `spec.align.toml` 文件内的 `# Command: flow.align` → `# Command: spec.align`
- [x] 1.12 更新 `spec.summary.toml` 文件内的 `# Command: flow.summary` → `# Command: spec.summary`

## 2. 适配器代码更新

- [x] 2.1 更新 `src/adapters/cursor.ts` 中的 commands 数组
- [x] 2.2 更新 `src/adapters/qwen.ts` 中的 commands 数组
- [x] 2.3 更新 `src/adapters/cline.ts` 中的 commands 数组
- [x] 2.4 更新 `src/adapters/iflow.ts` 中的 commands 数组
- [x] 2.5 更新 `src/adapters/utils.ts` 中的注释示例

## 3. 测试文件更新

- [x] 3.1 更新 `src/adapters/cursor.test.ts` 中的命令引用
- [x] 3.2 更新 `src/adapters/qwen.test.ts` 中的命令引用
- [x] 3.3 更新 `src/adapters/cline.test.ts` 中的命令引用
- [x] 3.4 更新 `src/adapters/iflow.test.ts` 中的命令引用
- [x] 3.5 更新 `src/adapters/index.test.ts` 中的命令引用
- [x] 3.6 更新 `src/commands/init.test.ts` 中的命令引用
- [x] 3.7 更新 `src/commands/new.test.ts` 中的命令引用

## 4. 源代码更新

- [x] 4.1 更新 `src/commands/init.ts` 中的提示信息
- [x] 4.2 更新 `src/commands/new.ts` 中的提示信息
- [x] 4.3 更新 `src/adapters/index.ts` 中的注释示例

## 5. 项目元数据更新

- [x] 5.1 更新 `package.json` 中的 name 字段为 "nano-spec-cli"
- [x] 5.2 更新 `package.json` 中的 description 字段
- [x] 5.3 更新 `README.md` 中的标题 "SpecFlow CLI" → "nano-spec CLI"
- [x] 5.4 更新 `README.md` 中所有 `/flow.*` → `/spec.*`
- [x] 5.5 更新 `README.md` 中所有 `flow.*.md` → `spec.*.md`
- [x] 5.6 更新 `README.md` 中所有 "SpecFlow" → "nano-spec"

## 6. 规范文档更新

- [x] 6.1 更新 `specflow/AGENTS.md` 中的 `<cmd_prefix>` 值为 `spec`
- [x] 6.2 更新 `specflow/AGENTS.md` 中的命令速查表
- [x] 6.3 更新 `specflow/AGENTS.md` 中的输出模板映射表
- [ ] 6.4 更新 `specflow/20260119-init-specflow/outputs/1-spec.md` 中的引用（可选）
- [ ] 6.5 更新 `specflow/20260119-init-specflow/outputs/2-plan.md` 中的引用（可选）
- [ ] 6.6 更新 `specflow/20260119-init-specflow/outputs/3-tasks.md` 中的引用（可选）
- [ ] 6.7 更新 `specflow/20260120-优化prompt以及简化模板机制/outputs/1-spec.md` 中的引用（可选）
- [ ] 6.8 更新 `specflow/20260120-优化prompt以及简化模板机制/outputs/2-plan.md` 中的引用（可选）
- [ ] 6.9 更新 `specflow/20260120-优化prompt以及简化模板机制/outputs/3-tasks.md` 中的引用（可选）

## 7. 构建和测试验证

- [x] 7.1 运行 `npm run build` 验证编译通过
- [x] 7.2 运行 `npm test` 确保所有测试通过
- [x] 7.3 检查生成的命令文件名是否正确（spec.*）
- [x] 7.4 检查命令文件内容中的引用是否正确
- [x] 7.5 使用搜索工具检查是否有遗漏的 `flow.` 引用
- [x] 7.6 验证 README.md 中的示例命令是否正确

## 8. 清理和收尾

- [x] 8.1 检查是否有旧的 `flow.*` 文件残留
- [ ] 8.2 检查 git 状态，确认所有更改已跟踪
- [ ] 8.3 更新文档中的版本号（如果需要）
- [ ] 8.4 验证项目可以正常初始化和使用

## 9. npm 发布准备

- [x] 9.1 创建 `.npmignore` 文件解决 `dist` 目录发布问题
- [x] 9.2 完善 `package.json` 添加发布所需字段（files、repository、keywords、author、license、bugs、homepage、publishConfig）
- [x] 9.3 创建 `LICENSE` 文件（MIT License）
- [x] 9.4 创建 `.github/workflows/ci-cd.yml` GitHub Actions CI/CD 配置
- [ ] 9.5 在 GitHub 仓库中配置 `NPM_TOKEN` Secret
- [ ] 9.6 检查包名 `nano-spec` 是否可用
- [ ] 9.7 构建并预览发布内容：`npm run build && npm pack --dry-run`
- [ ] 9.8 登录 npm：`npm login`
- [ ] 9.9 发布到 npm：`npm publish --access public`
- [ ] 9.10 验证发布：`npm view nano-spec`