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
**理由**：覆盖主流 AI 工具，提高 nano-spec 的通用性和可用性
**影响范围**：
- `src/adapters/`：新增 4 个适配器文件（claude-code.ts, copilot.ts, windsurf.ts, kilo-code.ts）
- `src/adapters/index.ts`：注册新适配器
- `src/commands/init.ts`：交互式选择时包含新工具选项
- 测试文件：为每个新适配器编写单元测试

---

## 新标准对齐
### [已确认] AGENTS.md 结构简化与任务记忆机制 `@2026-01-21`
**结论**：根据 assets 中新的 `_AGENTS.md` 标准，进行以下调整：
1. **简化目录结构**：移除 `templates/` 子目录，简化为仅包含 AGENTS.md 和任务目录
2. **简化输入优先级**：移除 `templates/*`，简化为 `alignment.md > brief.md / prd.md > assets/* > 现状`
3. **简化输出模板映射**：移除 `templates/*.md` 的优先级规则，改为内嵌默认模板
4. **新增任务记忆机制**：新增 3.3 章节，定义当前任务指针的读取和写入规则
5. **简化定制章节**：移除改输出格式条目，简化为仅支持改核心规则、加新命令、增强工作流

**理由**：简化系统复杂度，提高易用性，同时引入任务记忆机制支持断点续作
**影响范围**：
- `nanospec/AGENTS.md`：需要更新为新的结构
- `src/config/task-pointer.ts`：实现任务指针管理（已在 3-tasks.md 中规划）
- `src/commands/new.ts`：创建任务后自动设置当前任务指针（已在 3-tasks.md 中规划）
- `src/commands/switch.ts`：切换任务时更新当前任务指针（已在 3-tasks.md 中规划）

### [已确认] 新增 /init 命令 `@2026-01-21`
**结论**：新增 `/init` 命令，用于初始化或创建任务
**功能**：
- 检测环境状态（是否已初始化）
- 未初始化时执行 `specflow init` 初始化目录结构
- 已初始化时执行 `specflow new` 创建任务，并根据用户意图填写 brief.md
- 支持交互式创建任务
**理由**：提供统一的入口，简化初始化和任务创建流程
**影响范围**：
- 新增 `src/commands/init.ts`（或增强现有 init 命令）
- 更新 CLI 命令列表
- 更新 README.md 文档

### [已确认] 新增 /run 命令 `@2026-01-21`
**结论**：新增 `/run` 命令，实现一键执行工作流
**功能**：
- 检测当前任务目录的完成状态
- 顺序执行未完成的步骤：brief.md → 1-spec.md → 2-plan.md → 3-tasks.md → 执行任务
- 每完成一个阶段输出简要报告
- 全部执行完毕后输出汇总
**理由**：提供一键执行能力，提高开发效率
**影响范围**：
- 新增 `src/commands/run.ts`
- 更新 CLI 命令列表
- 更新 README.md 文档

### [已确认] 新增 /clarify 命令 `@2026-01-21`
**结论**：新增 `/clarify` 命令，用于澄清规格中的模糊点
**功能**：
- 扫描当前 `1-spec.md`，识别模糊或缺失的决策点
- 按类别检查覆盖度（功能范围、数据模型、交互流程、非功能性、边界情况、约束与权衡、术语一致）
- 逐一提问并将答案回写到规格和 alignment.md
- 最多问 5 个问题，控制澄清范围

**理由**：通过结构化提问消除歧义，提高规格质量
**影响范围**：
- 新增 `src/commands/clarify.ts`（或作为 slash command）
- 更新 CLI 命令列表（如适用）
- 更新 README.md 文档

### [已确认] /spec 命令增强环境感知 `@2026-01-21`
**结论**：`/spec` 命令必须强调环境感知，必须检查工作区现状
**变更**：
- Inputs 中明确"项目现状与素材：必须检查工作区现状"
- Rules 中强调"需求不是孤立的。必须说明新需求如何融入现有体系"
- Checklist 中增加"不确定处已标记"和"冲突已追加到 alignment.md"

**理由**：避免冲突，确保新需求正确融入现有体系
**影响范围**：
- 更新 `.iflow/commands/spec.1-spec.toml` 的 prompt
- 更新 `nanospec/templates/1-spec.md`（如存在）

### [已确认] /plan 命令新增透传模式 `@2026-01-21`
**结论**：`/plan` 命令新增"透传模式"（Passthrough）决策协议
**变更**：
- 新增 Decision Protocol，区分 Coding Task 和 Content/Writing Task
- Content/Writing Task 启用透传模式：2-plan.md 最多 3 行
- 透传模式下，所有后续方案优化回写到 1-spec.md，不得在 plan 展开

**理由**：简化文档类任务的流程，避免不必要的扩写
**影响范围**：
- 更新 `.iflow/commands/spec.2-plan.toml` 的 prompt
- 更新 `nanospec/templates/2-plan.md`（如存在）

### [已确认] /execute 命令强调及时更新状态 `@2026-01-21`
**结论**：`/execute` 命令必须强调及时更新状态
**变更**：
- Rules 中明确"每完成一个任务立即勾选，支持断点续执行"
- 执行流程中明确"完成一个任务立即勾选"
- Checklist 中明确"每完成一个任务已立即勾选"

**理由**：支持断点续执行，提高容错性
**影响范围**：
- 更新 `.iflow/commands/spec.3-execute.toml` 的 prompt

### [已确认] /align 命令强调标签规范和必须传播 `@2026-01-21`
**结论**：`/align` 命令必须强调标签规范和必须传播
**变更**：
- Rules 中明确"必须传播：口径变化必须同步到所有受影响 outputs"
- Checklist 中明确"受影响的 outputs 已同步更新"

**理由**：确保变更一致性，避免遗漏
**影响范围**：
- 更新 `.iflow/commands/spec.align.toml` 的 prompt

### [已确认] /summary 命令强调提炼决策和总结教训 `@2026-01-21`
**结论**：`/summary` 命令必须强调提炼决策和总结教训
**变更**：
- Rules 中明确"提炼决策：从 alignment.md 提取 [已确认] 条目"
- Rules 中明确"总结教训：识别频繁出现的 [冲突]、[偏差] 模式"
- Output 格式中强调"关键决策"和"教训"

**理由**：形成可复用经验，提升团队知识沉淀
**影响范围**：
- 更新 `.iflow/commands/spec.summary.toml` 的 prompt
- 更新 `nanospec/templates/summary.md`（如存在）

---

## 实现偏差修正

### [偏差] /run、/init、/clarify 应该是 slash commands 而不是 CLI commands `@2026-01-21`
**问题**：之前将 `/run`、`/init`、`/clarify` 实现为 CLI 命令（在 `src/commands/` 下），但它们应该是 AI 工具内部使用的 slash commands
**正确实现**：
- `/run`：辅助 slash command，用于一键执行工作流
- `/init`：辅助 slash command，用于初始化或创建任务
- `/clarify`：辅助 slash command，用于澄清规格中的模糊点

**理由**：这些命令主要在 AI 工具内部使用，用于辅助工作流，不是用户直接调用的 CLI 命令
**影响范围**：
- 移除 `src/commands/run.ts`（CLI 实现）
- 移除 `src/commands/init.ts` 中的环境检测和创建任务逻辑（保留 CLI init 命令的原有功能）
- 创建 `.iflow/commands/spec.run.toml`（slash command 模板）
- 创建 `.iflow/commands/spec.init.toml`（slash command 模板）
- 创建 `.iflow/commands/spec.clarify.toml`（slash command 模板）
- 更新 `3-tasks.md` 中的任务描述

### [已确认] CLI init 命令保持原有功能 `@2026-01-21`
**结论**： CLI 的 `nanospec init` 命令保持原有功能，仅用于初始化项目
**功能**：
- 支持交互式模式（`--interactive`）
- 支持 `--ai` 参数指定 AI 工具
- 支持 `--force` 参数强制覆盖
- 仅负责初始化目录结构和生成 AGENTS.md

**理由**：CLI 命令和 slash commands 职责分离
**影响范围**：
- `src/commands/init.ts`：移除环境检测和创建任务逻辑，保持原有的初始化功能
- 新增 slash command `/spec.init`：处理环境检测和创建任务流程

---

## 新增需求
### [已确认] init CLI 指令默认应该是交互式的 `@2026-01-21`
**结论**：`nanospec init` CLI 指令默认应该是交互式的，不需要 `--interactive` 参数
**变更**：
- 移除 `--interactive` 参数
- 默认行为就是交互式向导
- 保留 `--ai` 参数用于直接指定 AI 工具（非交互式快速初始化）
- 保留 `--force` 参数用于强制覆盖

**理由**：提升用户体验，降低学习成本，默认提供友好的交互式体验
**影响范围**：
- `src/commands/init.ts`：移除 `--interactive` 参数，默认启用交互式向导
- `src/index.ts`：更新 CLI 命令定义
- 更新文档和测试

### [已确认] 新增 config CLI 指令 `@2026-01-21`
**结论**：新增 `nanospec config` CLI 指令，用于配置管理
**功能**：
- `nanospec config`：查看当前配置
- `nanospec config set <key> <value>`：设置项目级配置
- `nanospec config get <key>`：获取配置值
- `nanospec config unset <key>`：删除配置项
- `nanospec config --global`：操作全局配置（用户级）
- `nanospec config --list`：列出所有配置项

**配置项支持**：
- `specs_root`：规格根目录名称
- `cmd_prefix`：命令前缀
- `default_adapter`：默认 AI 工具
- `template_format`：模板格式
- `auto_sync`：是否自动同步

**理由**：提供便捷的配置管理方式，无需手动编辑配置文件
**影响范围**：
- 新增 `src/commands/config.ts`
- 新增 `src/commands/config.test.ts`
- 更新 `src/index.ts`：添加 config 命令
- 更新 README.md 文档

### [已确认] README 突出快速上手，避免干巴巴罗列 API `@2026-01-22`
**结论**：v1.1 版本发布后，README 需要更新以突出快速上手和避免干巴巴罗列 API
**变更**：
- 将"快速开始"提到最前面，用场景化方式展示（3 分钟上手）
- 简化命令参考，用表格形式快速查阅
- 突出 v1.1 新特性（配置系统、预设包、任务记忆、8 个 AI 工具支持）
- 增加典型使用场景（前端开发、后端重构、文档写作）
- 增加常见问题（FAQ）章节
- 减少技术细节，增加使用场景和实际例子

**理由**：降低学习成本，让用户快速理解 NanoSpec 的价值，避免被大量 API 文档淹没
**影响范围**：
- README.md：完全重写，突出快速上手
- alignment.md：记录本次更新

## 实现问题
### [偏差] 命令列表硬编码在适配器中，导致新增命令时需要修改所有适配器 `@2026-01-22`
**问题**：当前每个适配器都硬编码了命令列表，例如 `cursor.ts`、`iflow.ts` 中都有：
```typescript
const commands = [
  'spec.1-spec',
  'spec.2-plan',
  'spec.3-execute',
  'spec.accept',
  'spec.align',
  'spec.summary',
  'spec.clarify',
  'spec.init',
  'spec.run',
];
```
这导致每次新增命令时，需要修改所有适配器文件，非常不合理。

**正确做法**：适配器应该自动扫描可用的命令模板文件，而不是硬编码列表。

**影响范围**：
- `src/adapters/utils.ts`：新增 `listAvailableCommands()` 函数，扫描 `src/static/commands/` 目录
- 所有适配器文件：移除硬编码的 `commands` 数组，改为调用 `listAvailableCommands()`
- `src/commands/sync.ts`：可能需要调整以支持自动发现命令

## 测试覆盖率

### [已确认] 需要补充单元测试的模块 `@2026-01-21`
**现状**：当前测试覆盖率较低，仅 37.65%，需要提升到 66.95%
**需要补充测试的模块**：
1. src/commands/config.test.ts
2. src/commands/preset.test.ts
3. src/commands/status.test.ts
4. src/commands/switch.test.ts
5. src/commands/sync.test.ts
6. src/config/config.test.ts
7. src/config/task-pointer.test.ts
8. src/adapters/claude-code.test.ts
9. src/adapters/copilot.test.ts
10. src/adapters/windsurf.test.ts
11. src/adapters/kilo-code.test.ts

**目标**：测试覆盖率从 37.65% 提升到 66.95%，共 128 个测试全部通过
**影响范围**：所有未测试的模块

### [偏差] 简化 init CLI 指令交互式流程 `@2026-01-22`
**问题**：当前 `nanospec init` 交互式初始化询问太多问题（AI 工具、specs_root、cmd_prefix、default_adapter），用户容易不选择
**解决方案**：简化交互式流程，只询问 AI 工具选择（单选），其他配置项使用默认值
**变更**：
- 交互式初始化只询问 AI 工具选择（单选）
- specs_root、cmd_prefix、default_adapter 等配置使用默认值
- 用户后续如需修改配置，使用 `nanospec config` 命令单独修改
**理由**：减少交互步骤，提升用户体验，降低学习成本，用户后续可通过 `nanospec config` 命令按需修改
**影响范围**：
- `src/commands/init.ts`：简化交互式向导，移除多余问题
- 配置文件会自动创建并使用默认值
- 文档更新，说明简化后的交互流程

### [偏差] GitHub CI/CD 构建失败：xcopy 命令在 Linux 环境不可用 `@2026-01-28`
**问题**：GitHub Actions 使用 `ubuntu-latest` 运行环境，`package.json` 中的 `build` 脚本使用了 Windows 特定的 `xcopy` 命令：
```json
"build": "tsc && xcopy /E /I /Y src\\static dist\\static && xcopy /E /I /Y src\\presets dist\\presets"
```
导致构建失败，错误信息：
```
sh: 1: xcopy: not found
```

**正确做法**：使用跨平台的文件复制方案，例如：
- 使用 Node.js 的 `fs-extra` 库（推荐）
- 或使用 `npm run build` 配合 TypeScript 配置自动处理
- 或使用 `cpx` 等跨平台复制工具

**影响范围**：
- `package.json`：修改 `build` 脚本
- 可能需要安装 `fs-extra` 依赖并编写构建脚本
- 确保 Windows 和 Linux 环境都能正常构建