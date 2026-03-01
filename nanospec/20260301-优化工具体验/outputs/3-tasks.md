# 任务清单：工具体验优化

## 1. 模板流程简化

- [x] 1.1 更新 `src/static/commands/spec.init.toml`，移除初始化检测分支并聚焦创建任务
- [x] 1.2 更新模板回归测试，校验新语义并防止旧逻辑回流
- 验收条件：`spec.init` 模板不再要求先判断“是否初始化”，且澄清门禁仍存在

## 2. `new` 无参交互能力

- [x] 2.1 在 `src/commands/new.ts` 增加无参交互输入（默认名“待命名”）
- [x] 2.2 更新 `src/commands/new.test.ts` 覆盖无参交互、默认回退与带参不受影响
- 验收条件：`nanospec new` 无参进入交互，回车可创建默认任务名

## 3. CLI 命令简写支持

- [x] 3.1 重构 `src/index.ts` 为可测试的 `createProgram()` 并添加主命令 alias（至少含 `switch -> s`）
- [x] 3.2 更新 `bin/nanospec.js` 以新方式启动 CLI
- [x] 3.3 新增 CLI 注册测试，校验 alias 映射
- 验收条件：命令注册层能确认 `switch` 的 `s` 别名及其他主命令别名存在

## 4. 文档与变更记录

- [x] 4.1 更新 `README.md` 说明 `nanospec new` 无参交互和命令简写
- [x] 4.2 更新 `CHANGELOG.md` 的 Unreleased
- 验收条件：文档与实际行为一致，且变更记录完整

## 5. 验证与回填

- [x] 5.1 运行变更路径测试并确保通过
- [x] 5.2 勾选所有已完成任务
- 验收条件：测试通过，`outputs/3-tasks.md` 状态完整可恢复
