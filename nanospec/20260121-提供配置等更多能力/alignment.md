# 对齐记录

## 待确认

### [待确认] 预设合并策略
**问题**：预设包的命令/模板与项目自定义内容冲突时，如何处理？
**选项**：
- 覆盖：预设内容覆盖项目自定义
- 跳过：保留项目自定义，跳过预设内容
- 提示用户：交互式询问用户选择
**影响范围**：`nanospec preset install` 命令

### [待确认] 配置项范围
**问题**：是否需要支持更多配置项？
**可能扩展**：
- 自定义命令目录（默认：.iflow/commands/）
- 自定义模板目录（默认：nanospec/templates/）
- 模板变量（如项目名、仓库名、负责人等）
**影响范围**：配置系统设计

### [待确认] 交互式体验范围
**问题**：是否所有命令都支持交互式模式，还是仅部分关键命令？
**当前计划**：`init`、`switch`、`preset install` 支持交互式
**影响范围**：交互式体验实现工作量

---

## 已确认

### [已确认] init 命令必须支持交互式模式 `@2026-01-21`
**结论**：`nanospec init` 必须支持交互式选择 AI 工具，不能让用户手动输入完整工具名
**理由**：提升用户体验，降低学习成本，参考 OpenSpec 的交互式初始化体验
**影响范围**：
- `src/commands/init.ts`：添加 `--interactive` 选项
- 引入 `inquirer` 库实现交互式选择
- 需要覆盖 Claude Code（新增适配器）

### [已确认] switch 命令必须支持交互式模式 `@2026-01-21`
**结论**：`nanospec switch` 无参数时必须显示任务列表供交互选择
**理由**：避免用户手动输入完整任务名，提升易用性
**影响范围**：
- `src/commands/switch.ts`：无参数时启动交互式选择
- 引入 `inquirer` 库实现任务列表展示

### [已确认] new 命令必须自动记录当前任务指针 `@2026-01-21`
**结论**：`nanospec new <name>` 创建任务后，必须自动将其设为当前任务
**理由**：避免用户手动切换，支持断点续作
**影响范围**：
- `src/commands/new.ts`：创建任务后调用 `setCurrentTask()`
- `src/config/task-pointer.ts`：提供任务指针管理

### [已确认] 新增 4 个主流 AI 工具适配器 `@2026-01-21`
**结论**：参考 OpenSpec 支持的 AI 工具，新增以下 4 个适配器：
1. **Claude Code** - Anthropic 的命令行代理
2. **GitHub Copilot** - 广泛使用的代码补全工具
3. **Windsurf** - 新的 AI 原生编辑器
4. **Kilo Code** - 新的 AI 原生编辑器

**理由**：覆盖主流 AI 工具，提升 nano-spec 的通用性和可用性
**影响范围**：
- `src/adapters/`：新增 4 个适配器文件（claude-code.ts, copilot.ts, windsurf.ts, kilo-code.ts）
- `src/adapters/index.ts`：注册新适配器
- `src/commands/init.ts`：交互式选择时包含新工具选项
- 测试文件：为每个新适配器编写单元测试