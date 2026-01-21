# 对齐记录

## 待确�?
### [待确认] 预设合并策略
**问题**：预设包的命�?模板与项目自定义内容冲突时，如何处理�?**选项**�?- 覆盖：预设内容覆盖项目自定义
- 跳过：保留项目自定义，跳过预设内�?- 提示用户：交互式询问用户选择
**影响范围**：`nanospec preset install` 命令

### [待确认] 配置项范�?**问题**：是否需要支持更多配置项�?**可能扩展**�?- 自定义命令目录（默认�?iflow/commands/�?- 自定义模板目录（默认：nanospec/templates/�?- 模板变量（如项目名、仓库名、负责人等）
**影响范围**：配置系统设�?
### [待确认] 交互式体验范�?**问题**：是否所有命令都支持交互式模式，还是仅部分关键命令？
**当前计划**：`init`、`switch`、`preset install` 支持交互�?**影响范围**：交互式体验实现工作�?
---

## 已确�?
### [已确认] init 命令必须支持交互式模�?`@2026-01-21`
**结论**：`nanospec init` 必须支持交互式选择 AI 工具，不能让用户手动输入完整工具�?**理由**：提升用户体验，降低学习成本，参�?OpenSpec 的交互式初始化体�?**影响范围**�?- `src/commands/init.ts`：添�?`--interactive` 选项
- 引入 `inquirer` 库实现交互式选择
- 需要覆�?Claude Code（新增适配器）

### [已确认] switch 命令必须支持交互式模�?`@2026-01-21`
**结论**：`nanospec switch` 无参数时必须显示任务列表供交互选择
**理由**：避免用户手动输入完整任务名，提升易用�?**影响范围**�?- `src/commands/switch.ts`：无参数时启动交互式选择
- 引入 `inquirer` 库实现任务列表展�?
### [已确认] new 命令必须自动记录当前任务指针 `@2026-01-21`
**结论**：`nanospec new <name>` 创建任务后，必须自动将其设为当前任务
**理由**：避免用户手动切换，支持断点续作
**影响范围**�?- `src/commands/new.ts`：创建任务后调用 `setCurrentTask()`
- `src/config/task-pointer.ts`：提供任务指针管�?
### [已确认] 新增 4 个主�?AI 工具适配�?`@2026-01-21`
**结论**：参�?OpenSpec 支持�?AI 工具，新增以�?4 个适配器：
1. **Claude Code** - Anthropic 的命令行代理
2. **GitHub Copilot** - 广泛使用的代码补全工�?3. **Windsurf** - 新的 AI 原生编辑�?4. **Kilo Code** - 新的 AI 原生编辑�?
**理由**：覆盖主�?AI 工具，提�?nano-spec 的通用性和可用�?**影响范围**�?- `src/adapters/`：新�?4 个适配器文件（claude-code.ts, copilot.ts, windsurf.ts, kilo-code.ts�?- `src/adapters/index.ts`：注册新适配�?- `src/commands/init.ts`：交互式选择时包含新工具选项
- 测试文件：为每个新适配器编写单元测�?
---

## 新标准对�?
### [已确认] AGENTS.md 结构简化与任务记忆机制 `@2026-01-21`
**结论**：根�?assets 中新�?`_AGENTS.md` 标准，进行以下调整：
1. **简化目录结�?*：移�?`templates/` 子目录，简化为仅包�?AGENTS.md 和任务目�?2. **简化输入优先级**：移�?`templates/*`，简化为 `alignment.md > brief.md / prd.md > assets/* > 现状`
3. **简化输出模板映�?*：移�?`templates/*.md` 的优先级规则，改为内嵌默认模�?4. **新增任务记忆机制**：新�?3.3 章节，定义当前任务指针的读取和写入规�?5. **简化定制章�?*：移�?改输出格�?条目，简化为仅支持改核心规则、加新命令、增强工作流

**理由**：简化系统复杂度，提高易用性，同时引入任务记忆机制支持断点续作
**影响范围**�?- `nanospec/AGENTS.md`：需要更新为新的结构
- `src/config/task-pointer.ts`：实现任务指针管理（已在 3-tasks.md 中规划）
- `src/commands/new.ts`：创建任务后自动设置当前任务指针（已�?3-tasks.md 中规划）
- `src/commands/switch.ts`：切换任务时更新当前任务指针（已�?3-tasks.md 中规划）

### [已确认] 新增 /init 命令 `@2026-01-21`
**结论**：新�?`/init` 命令，用于初始化或创建任�?**功能**�?- 检测环境状态（是否已初始化�?- 未初始化时执�?`specflow init` 初始化目录结�?- 已初始化时执�?`specflow new` 创建任务，并根据用户意图填写 brief.md
- 支持交互式创建任�?
**理由**：提供统一的入口，简化初始化和任务创建流�?**影响范围**�?- 新增 `src/commands/init.ts`（或增强现有 init 命令�?- 更新 CLI 命令列表
- 更新 README.md 文档

### [已确认] 新增 /run 命令 `@2026-01-21`
**结论**：新�?`/run` 命令，实现一键执行工作流
**功能**�?- 检测当前任务目录的完成状�?- 顺序执行未完成的步骤：brief.md �?1-spec.md �?2-plan.md �?3-tasks.md �?执行任务
- 每完成一个阶段输出简要报�?- 全部执行完毕后输出汇�?
**理由**：提供一键执行能力，提高开发效�?**影响范围**�?- 新增 `src/commands/run.ts`
- 更新 CLI 命令列表
- 更新 README.md 文档

### [已确认] 新增 /clarify 命令 `@2026-01-21`
**结论**：新�?`/clarify` 命令，用于澄清规格中的模糊点
**功能**�?- 扫描当前 `1-spec.md`，识别模糊或缺失的决策点
- 按类别检查覆盖度（功能范围、数据模型、交互流程、非功能性、边界情况、约束与权衡、术语一致）
- 逐一提问并将答案回写到规格和 alignment.md
- 最多问 5 个问题，控制澄清范围

**理由**：通过结构化提问消除歧义，提高规格质量
**影响范围**�?- 新增 `src/commands/clarify.ts`（或作为 slash command�?- 更新 CLI 命令列表（如适用�?- 更新 README.md 文档

### [已确认] /spec 命令增强环境感知 `@2026-01-21`
**结论**：`/spec` 命令必须强调环境感知，必须检查工作区现状
**变更**�?- Inputs 中明�?项目现状与素�?必须检�?- Rules 中强�?需求不是孤立的。必须说明新需求如何融入现有体�?
- Checklist 中增�?不确定处已标�?�?冲突已追加到 alignment.md"

**理由**：避免冲突，确保新需求正确融入现有体�?**影响范围**�?- 更新 `.iflow/commands/spec.1-spec.toml` �?prompt
- 更新 `nanospec/templates/1-spec.md`（如存在�?
### [已确认] /plan 命令新增透传模式 `@2026-01-21`
**结论**：`/plan` 命令新增"透传模式"（Passthrough）决策协�?**变更**�?- 新增 Decision Protocol，区�?Coding Task �?Content/Writing Task
- Content/Writing Task 启用透传模式�?-plan.md 最�?3 �?- 透传模式下，所有后续方案优化回写到 1-spec.md，不得在 plan 展开

**理由**：简化文档类任务的流程，避免不必要的扩写
**影响范围**�?- 更新 `.iflow/commands/spec.2-plan.toml` �?prompt
- 更新 `nanospec/templates/2-plan.md`（如存在�?
### [已确认] /execute 命令强调及时更新状�?`@2026-01-21`
**结论**：`/execute` 命令必须强调及时更新状�?**变更**�?- Rules 中明�?每完成一个任务立即勾选，支持断点续执�?
- 执行流程中明�?完成一个任务立即勾�?
- Checklist 中明�?每完成一个任务已立即勾�?

**理由**：支持断点续执行，提高容错�?**影响范围**�?- 更新 `.iflow/commands/spec.3-execute.toml` �?prompt

### [已确认] /align 命令强调标签规范和必须传�?`@2026-01-21`
**结论**：`/align` 命令必须强调标签规范和必须传�?**变更**�?- Rules 中明�?必须传播：口径变化必须同步到所有受影响 outputs"
- Checklist 中明�?受影响的 outputs 已同步更�?

**理由**：确保变更一致性，避免遗漏
**影响范围**�?- 更新 `.iflow/commands/spec.align.toml` �?prompt

### [已确认] /summary 命令强调提炼决策和总结教训 `@2026-01-21`
**结论**：`/summary` 命令必须强调提炼决策和总结教训
**变更**�?- Rules 中明�?提炼决策：从 alignment.md 提取 [已确认] 条目"
- Rules 中明�?总结教训：识别频繁出现的 [冲突]、[偏差] 模式"
- Output 格式中强�?关键决策"�?教训"

**理由**：形成可复用经验，提升团队知识沉淀
**影响范围**�?- 更新 `.iflow/commands/spec.summary.toml` �?prompt
- 更新 `nanospec/templates/summary.md`（如存在�?
---

## 实现偏差修正

### [偏差] /run�?init�?clarify 应该�?slash commands 而不�?CLI commands `@2026-01-21`
**问题**：之前将 `/run`、`/init`、`/clarify` 实现�?CLI 命令（在 `src/commands/` 下），但它们应该�?AI 工具内部使用�?slash commands
**正确实现**�?- `/run`：辅�?slash command，用于一键执行工作流
- `/init`：辅�?slash command，用于初始化或创建任�?- `/clarify`：辅�?slash command，用于澄清规格中的模糊点

**理由**：这些命令主要在 AI 工具内部使用，用于辅助工作流，不是用户直接调用的 CLI 命令
**影响范围**�?- 移除 `src/commands/run.ts`（CLI 实现�?- 移除 `src/commands/init.ts` 中的环境检测和创建任务逻辑（保�?CLI init 命令的原有功能）
- 创建 `.iflow/commands/spec.run.toml`（slash command 模板�?- 创建 `.iflow/commands/spec.init.toml`（slash command 模板�?- 创建 `.iflow/commands/spec.clarify.toml`（slash command 模板�?- 更新 `3-tasks.md` 中的任务描述

### [已确认] CLI init 命令保持原有功能 `@2026-01-21`
**结论**：CLI �?`nanospec init` 命令保持原有功能，仅用于初始化项�?**功能**�?- 支持交互式模式（`--interactive`�?- 支持 `--ai` 参数指定 AI 工具
- 支持 `--force` 参数强制覆盖
- 仅负责初始化目录结构和生�?AGENTS.md

**理由**：CLI 命令�?slash commands 职责分离
**影响范围**�?- `src/commands/init.ts`：移除环境检测和创建任务逻辑，保持原有的初始化功�?- 新增 slash command `/spec.init`：处理环境检测和创建任务流程

---

## 新增需�?
### [已确认] init CLI 指令默认应该是交互式�?`@2026-01-21`
**结论**：`nanospec init` CLI 指令默认应该是交互式的，不需�?`--interactive` 参数
**变更**�?- 移除 `--interactive` 参数
- 默认行为就是交互式向�?- 保留 `--ai` 参数用于直接指定 AI 工具（非交互式快速初始化�?- 保留 `--force` 参数用于强制覆盖

**理由**：提升用户体验，降低学习成本，默认提供友好的交互式体�?**影响范围**�?- `src/commands/init.ts`：移�?`--interactive` 参数，默认启用交互式向导
- `src/index.ts`：更�?CLI 命令定义
- 更新文档和测�?
### [已确认] 新增 config CLI 指令 `@2026-01-21`
**结论**：新�?`nanospec config` CLI 指令，用于配置管�?**功能**�?- `nanospec config`：查看当前配�?- `nanospec config set <key> <value>`：设置项目级配置
- `nanospec config get <key>`：获取配置�?- `nanospec config unset <key>`：删除配置项
- `nanospec config --global`：操作全局配置（用户级�?- `nanospec config --list`：列出所有配置项

**配置项支�?*�?- `specs_root`：规格根目录名称
- `cmd_prefix`：命令前缀
- `default_adapter`：默�?AI 工具
- `template_format`：模板格�?- `auto_sync`：是否自动同�?
**理由**：提供便捷的配置管理方式，无需手动编辑配置文件
**影响范围**�?- 新增 `src/commands/config.ts`
- 新增 `src/commands/config.test.ts`
- 更新 `src/index.ts`：添�?config 命令
- 更新 README.md 文档

## ��������

### [��ȷ��] ����������Ŀ��Ԫ���� @2026-01-21`n**����**���Ѳ�������ģ��ĵ�Ԫ���ԣ����Ը����ʴ� 37.65% ������ 66.95%
**��Ҫ����Ĳ���**��
1. src/commands/config.test.ts`n2. src/commands/preset.test.ts`n3. src/commands/status.test.ts`n4. src/commands/switch.test.ts`n5. src/commands/sync.test.ts`n6. src/config/config.test.ts`n7. src/config/task-pointer.test.ts`n8. src/adapters/claude-code.test.ts`n9. src/adapters/copilot.test.ts`n10. src/adapters/windsurf.test.ts`n11. src/adapters/kilo-code.test.ts`n
**���**�����Ը����ʴ� 37.65% ������ 66.95%��128 ������ȫ��ͨ����
**Ӱ�췶Χ**������δ����ģ��
