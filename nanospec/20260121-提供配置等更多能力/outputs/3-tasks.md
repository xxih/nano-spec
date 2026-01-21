# 任务清单：nano-spec 配置系统与增强能力

## 1. 配置系统实现

- [x] 1.1 创建配置解析模块 `src/config/config.ts`
  - [x] 引入 `cosmiconfig` 依赖
  - [x] 实现 `loadConfig()` 函数
  - [x] 实现多级配置合并（项目级 > 用户级 > 默认）
  - [x] 实现配置验证和默认值
  - [ ] 编写单元测试 `src/config/config.test.ts`

- [x] 1.2 集成配置到 `init` 命令
  - [x] 修改 `src/commands/init.ts` 读取 `default_adapter` 配置
  - [x] 更新 `init.ts` 单元测试

- [x] 1.3 集成配置到 `new` 命令
  - [x] 修改 `src/commands/new.ts` 读取 `specs_root` 配置
  - [x] 更新 `new.ts` 单元测试

---

## 2. 预设包系统实现

- [x] 2.1 创建预设管理命令 `src/commands/preset.ts`
  - [x] 实现 `listPresets()` 命令
  - [x] 实现 `installPreset()` 命令
  - [x] 实现 `uninstallPreset()` 命令
  - [x] 实现预设冲突处理逻辑（交互式询问）
  - [ ] 编写单元测试 `src/commands/preset.test.ts`

- [x] 2.2 创建内置预设包
  - [x] 创建 `src/presets/frontend/preset.json`
  - [x] 创建 `src/presets/backend/preset.json`
  - [x] 创建 `src/presets/refactor/preset.json`
  - [x] 创建 `src/presets/docs/preset.json`
  - [x] 为每个预设添加 `commands/` 和 `templates/` 示例文件

- [x] 2.3 更新构建脚本
  - [x] 修改 `package.json` 的 `build` 脚本，复制 `src/presets/` 到 `dist/presets/`

---

## 3. 任务记忆与断点续作实现

- [x] 3.1 创建任务指针管理模块 `src/config/task-pointer.ts`
  - [x] 实现 `getCurrentTask()` 函数
  - [x] 实现 `setCurrentTask()` 函数
  - [x] 实现 `clearCurrentTask()` 函数
  - [ ] 编写单元测试 `src/config/task-pointer.test.ts`

- [x] 3.2 集成任务指针到 `new` 命令
  - [x] 修改 `src/commands/new.ts`，创建任务后自动设置为当前任务
  - [x] 更新 `new.ts` 单元测试

- [x] 3.3 创建 `switch` 命令 `src/commands/switch.ts`
  - [x] 实现 `nanospec switch [name]` 命令
  - [x] 实现有参数时切换到指定任务
  - [x] 实现无参数时交互式选择任务
  - [ ] 编写单元测试 `src/commands/switch.test.ts`

- [x] 3.4 创建 `status` 命令 `src/commands/status.ts`
  - [x] 实现 `nanospec status` 命令
  - [x] 显示当前激活任务信息
  - [x] 显示任务状态（brief.md、outputs/1-spec.md 等）
  - [ ] 编写单元测试 `src/commands/status.test.ts`

---

## 4. 交互式体验实现

- [x] 4.1 引入交互式库
  - [x] 安装 `inquirer` 依赖
  - [x] 更新 `package.json`

- [x] 4.2 增强 `init` 命令交互式体验
  - [x] 修改 `src/commands/init.ts`，添加 `--interactive` 选项
  - [x] 实现 `interactiveInit()` 函数
  - [x] 实现工具选择交互（多选）
  - [x] 实现配置向导（specs_root、cmd_prefix 等）
  - [x] 生成配置文件
  - [ ] 更新 `init.ts` 单元测试

- [x] 4.3 增强 `switch` 命令交互式体验
  - [x] 修改 `src/commands/switch.ts`，使用 `inquirer` 显示任务列表
  - [ ] 更新 `switch.ts` 单元测试

- [ ] 4.4 增强 `preset` 命令交互式体验
  - [ ] 修改 `src/commands/preset.ts`，使用 `inquirer` 显示预设列表
  - [ ] 更新 `preset.ts` 单元测试

---

## 5. 命令同步增强

- [x] 5.1 创建 `sync` 命令 `src/commands/sync.ts`
  - [x] 实现 `nanospec sync [--adapter <name>]` 命令
  - [x] 实现同步命令/模板到 AI 工具目录
  - [x] 实现增量同步逻辑（比较文件哈希或修改时间）
  - [ ] 编写单元测试 `src/commands/sync.test.ts`

- [ ] 5.2 增强 adapter 系统
  - [ ] 修改 `src/adapters/index.ts`，在 `AIAdapter` 接口添加 `incrementalSync` 方法
  - [ ] 更新现有 adapter 实现（cursor、qwen、iflow、cline）
  - [ ] 更新 adapter 单元测试

---

## 6. 测试与文档

- [x] 6.1 运行所有测试
  - [x] 运行 `npm test` 确保所有测试通过
  - [ ] 运行 `npm run test:coverage` 检查测试覆盖率

- [x] 6.2 更新 README.md
  - [x] 添加配置系统说明章节
  - [x] 添加预设包使用指南章节
  - [x] 添加任务记忆与断点续作说明章节
  - [x] 添加交互式命令说明章节
  - [x] 更新命令列表和示例

- [x] 6.3 构建和验证
  - [x] 运行 `npm run build` 构建项目
  - [x] 验证 `dist/` 目录结构正确
  - [x] 验证预设包已正确复制到 `dist/presets/`

---

## 7. 依赖管理

- [x] 7.1 安装新依赖
  - [ ] 安装 `cosmiconfig`
  - [x] 安装 `inquirer`
  - [x] 安装 `@types/inquirer`（TypeScript 类型定义）

- [x] 7.2 更新 package.json
  - [x] 添加新依赖到 `dependencies`
  - [ ] 更新 `engines` 字段（如需要）

---

## 8. 对齐问题处理

- [x] 8.1 确认预设合并策略
  - [x] 与用户确认预设冲突处理方式（覆盖/跳过/提示用户）
  - [x] 实现 `alignment.md` 中确认的策略

- [x] 8.2 确认配置项范围
  - [x] 与用户确认是否需要支持更多配置项
  - [x] 根据确认结果扩展配置系统

- [x] 8.3 确认交互式体验范围
  - [x] 与用户确认哪些命令需要支持交互式模式
  - [x] 根据确认结果调整实现计划

- [x] 8.4 确认新增 AI 工具适配器需求
  - [x] 参考 OpenSpec 确定 4 个主流 AI 工具
  - [x] 确认 init 命令交互式体验要求
  - [x] 确认 switch 命令交互式体验要求
  - [x] 确认 new 命令自动记录指针要求

---

## 9. AI 工具适配器扩展

- [x] 9.1 创建 Claude Code 适配器 `src/adapters/claude-code.ts`
  - [x] 实现 AIAdapter 接口
  - [x] 配置命令目录 `.claude/commands/`
  - [x] 实现命令生成逻辑
  - [ ] 编写单元测试 `src/adapters/claude-code.test.ts`

- [x] 9.2 创建 GitHub Copilot 适配器 `src/adapters/copilot.ts`
  - [x] 实现 AIAdapter 接口
  - [x] 配置命令目录 `.github/copilot/commands/`
  - [x] 实现命令生成逻辑
  - [ ] 编写单元测试 `src/adapters/copilot.test.ts`

- [x] 9.3 创建 Windsurf 适配器 `src/adapters/windsurf.ts`
  - [x] 实现 AIAdapter 接口
  - [x] 配置命令目录 `.windsurf/commands/`
  - [x] 实现命令生成逻辑
  - [ ] 编写单元测试 `src/adapters/windsurf.test.ts`

- [x] 9.4 创建 Kilo Code 适配器 `src/adapters/kilo-code.ts`
  - [x] 实现 AIAdapter 接口
  - [x] 配置命令目录 `.kilo/commands/`
  - [x] 实现命令生成逻辑
  - [ ] 编写单元测试 `src/adapters/kilo-code.test.ts`

- [x] 9.5 注册新适配器到 adapter 系统
  - [x] 修改 `src/adapters/index.ts` 导入新适配器
  - [x] 在 `adapters` 对象中注册新适配器
  - [x] 更新 `listAdapters()` 返回所有 8 个适配器
  - [ ] 更新 adapter 单元测试

- [x] 9.6 更新 init 命令交互式工具选择
  - [x] 修改 `src/commands/init.ts` 的工具选择列表
  - [x] 包含所有 8 个适配器选项
  - [x] 提供工具描述帮助用户选择
  - [ ] 更新 `init.ts` 单元测试

---

## 验收标准

- [x] 所有单元测试通过
- [ ] 测试覆盖率不低于 80%
- [x] 构建成功，无 TypeScript 编译错误
- [x] 配置文件正确加载和应用
- [x] 预设包能正确安装和卸载
- [x] 任务指针正确持久化和恢复
- [x] 交互式命令用户体验流畅
- [x] README.md 文档完整准确
- [ ] 所有 `alignment.md` 中的待确认项已解决