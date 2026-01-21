# 规格说明：nano-spec 配置系统与增强能力

## 背景与目标

### 背景
当前 `nano-spec` 已实现基础的 Spec 驱动开发框架，具备：
- CLI 命令：`init`（初始化）、`new`（创建任务）
- 多 AI 工具适配器系统（cursor, qwen, iflow, cline）
- 基础工作流命令模板（1-spec, 2-plan, 3-execute, accept, align, summary）
- AGENTS.md 通用规范

### 目标
为 `nano-spec` 提供更完善的配置和扩展能力，使其成为：
1. **可配置**：支持多级配置覆盖，适应不同团队/项目需求
2. **可扩展**：通过预设包快速注入领域能力
3. **可持久化**：支持任务记忆与断点续作
4. **易用**：提供交互式体验降低学习成本
5. **广泛兼容**：覆盖主流 AI 工具（参考 OpenSpec，新增 Claude Code、GitHub Copilot、Windsurf、Kilo Code）

### 目标
为 `nano-spec` 提供更完善的配置和扩展能力，使其成为：
1. **可配置**：支持多级配置覆盖，适应不同团队/项目需求
2. **可扩展**：通过预设包快速注入领域能力
3. **可持久化**：支持任务记忆与断点续作
4. **易用**：提供交互式体验降低学习成本

### 非目标
- 不涉及具体的 AI 模型集成或提示词优化
- 不改变现有 AGENTS.md 核心规范结构
- 不提供图形化界面（交互式体验仅限命令行）

---

## 核心组成

```
nano-spec 配置系统与增强能力
├── 配置管理
│   ├── 配置文件支持（.nanospecrc / nanospec.config.js）
│   ├── 多级配置覆盖（项目级 > 用户级 > 默认）
│   ├── 配置项：specs_root、cmd_prefix、default_adapter、template_format
│   └── 配置验证与默认值
├── 预设包系统
│   ├── 预设包结构（preset.json + commands/ + templates/）
│   ├── 内置预设：frontend、backend、refactor、docs
│   ├── 预设安装命令：`nanospec preset install <name>`
│   └── 预设列表命令：`nanospec preset list`
├── 任务记忆与断点续作
│   ├── 当前任务指针（.nanospec/current-task）
│   ├── 自动更新机制（new/switch 时）
│   ├── 上下文感知（命令默认读取当前任务）
│   └── 状态恢复命令：`nanospec status`
├── 交互式体验
│   ├── 工具选择交互（多选）
│   ├── 任务选择交互（单选）
│   ├── 配置向导（交互式配置）
│   └── 确认提示（覆盖/删除等操作）
└── 同步命令到工具
    ├── 自动同步（init 时）
    ├── 手动同步命令：`nanospec sync`
    └── 增量同步（仅更新变化的文件）
```

### 详细说明

#### 1. 配置管理
**交付物表现**：
- 用户可在项目根目录创建 `.nanospecrc` (JSON/YAML) 或 `nanospec.config.js` (CommonJS/ESM)
- 配置项生效优先级：项目级配置 > 用户级配置 (`~/.nanospecrc`) > 默认配置
- CLI 命令读取配置并应用（如 `nanospec init` 读取 `default_adapter`）

**可配置项**：
```json
{
  "specs_root": "specs",           // 规格根目录名（默认：nanospec）
  "cmd_prefix": "spec",            // 命令前缀（默认：spec）
  "default_adapter": "cursor",     // 默认 AI 工具
  "template_format": "md",         // 模板格式（默认：md）
  "auto_sync": true                // init 时自动同步（默认：true）
}
```

#### 2. 预设包系统
**交付物表现**：
- 预设包为目录结构，包含：
  - `preset.json`：元数据（名称、描述、版本、依赖）
  - `commands/`：追加的命令模板
  - `templates/`：追加的输出模板
- 内置预设位于 `src/presets/`，发布时打包到 `dist/presets/`
- 安装时将预设内容合并到项目（追加到 AGENTS.md、复制命令/模板）

**内置预设示例**：
- `frontend`：前端特化规范（组件/状态/交互）
- `backend`：后端开发规范（API/数据模型/服务架构）
- `refactor`：重构优化清单（评审/风险控制）
- `docs`：文档写作模板（信息架构/受众分析）

#### 3. 任务记忆与断点续作
**交付物表现**：
- 当前任务指针存储在 `.nanospec/current-task`（文件内容为任务目录名）
- `nanospec new <name>` 自动将新任务设为当前任务（无需手动 switch）
- `nanospec switch <name>` 切换当前任务
- `nanospec switch` 无参数时显示任务列表供交互选择（避免手动输入完整任务名）
- 所有工作流命令（如 `/spec.1-spec`）默认读取当前任务指针，无需手动指定
- `nanospec status` 显示当前激活任务信息

#### 4. 交互式体验
**交付物表现**：
- `nanospec init` 支持交互式向导（工具选择、配置项确认），参考 OpenSpec 的交互式初始化体验
- 交互式工具选择支持多选，覆盖主流 AI 工具（包括 Claude Code、GitHub Copilot、Windsurf、Kilo Code）
- `nanospec switch` 无参数时显示任务列表供交互选择
- `nanospec preset install` 无参数时显示预设列表供选择
- 危险操作（覆盖、删除）前显示确认提示

#### 5. 同步命令到工具
**交付物表现**：
- `nanospec sync` 将项目内的命令/模板同步到各 AI 工具目录
- 支持指定目标工具：`nanospec sync --adapter cursor`
- 增量同步：仅更新内容变化的文件，避免不必要的写入

#### 6. CLI 命令增强
**交付物表现**：
- `nanospec init` 默认启用交互式向导，无需 `--interactive` 参数
- `nanospec init --ai <tool>` 支持非交互式快速初始化
- `nanospec config` 查看当前配置
- `nanospec config set <key> <value>` 设置项目级配置
- `nanospec config get <key>` 获取配置值
- `nanospec config unset <key>` 删除配置项
- `nanospec config --global` 操作全局配置（用户级）
- `nanospec config --list` 列出所有配置项

---

## 成功标志

### 功能验收
- [ ] **配置管理**：创建 `.nanospecrc` 后，CLI 命令能正确读取并应用配置
- [ ] **多级覆盖**：用户级配置能被项目级配置覆盖
- [ ] **预设安装**：`nanospec preset install frontend` 成功将预设内容合并到项目
- [ ] **预设列表**：`nanospec preset list` 显示所有可用预设
- [ ] **任务记忆**：创建任务后自动设为当前任务，`nanospec status` 显示正确
- [ ] **任务切换**：`nanospec switch` 能正确切换当前任务指针
- [ ] **交互式向导**：`nanospec init --interactive` 能引导用户完成配置
- [ ] **命令同步**：`nanospec sync` 能将命令同步到目标工具目录

### 非功能验收
- [ ] **向后兼容**：无配置文件时，CLI 仍能使用默认配置正常工作
- [ ] **配置验证**：无效配置项应显示警告并使用默认值
- [ ] **错误处理**：预设不存在时显示友好错误提示
- [ ] **文档完整**：所有新增命令有 `--help` 说明

---

## 约束与注意

### 必须遵守的限制条件

- [ ] **代码规范**：遵循现有 TypeScript 代码风格（使用 `commander` 库）
- [ ] **目录约定**：
  - 配置文件：项目根目录 `.nanospecrc` / `nanospec.config.js`
  - 当前任务指针：`.nanospec/current-task`
  - 预设包：`src/presets/<name>/` → `dist/presets/<name>/`
- [ ] **依赖项**：
  - 使用现有 `commander` 库处理 CLI 参数
  - 使用 Node.js 内置 `fs`/`path` 模块处理文件操作
  - 配置解析支持 JSON/YAML/JS（可引入 `cosmiconfig` 库）
- [ ] **兼容性**：
  - Node.js >= 18（与现有要求一致）
  - 不破坏现有 `init`/`new` 命令的行为
- [ ] **测试覆盖**：
  - 新增功能需编写单元测试（使用 `vitest`）
  - 测试覆盖率不低于现有水平
- [ ] **环境感知**：
  - 新需求必须融入现有体系（是新增、修改还是重构？）
  - 必须检查工作区现状（现有的代码、文档、资料或历史版本）
  - 避免与现有功能冲突

### 技术债务与风险
- [ ] **配置解析**：引入 `cosmiconfig` 增加依赖体积，需评估是否必要
- [ ] **预设冲突**：预设包与项目自定义内容可能冲突，需定义合并策略
- [ ] **任务指针**：文件损坏或丢失时需有恢复机制

---

## 待澄清问题

以下问题已记录到 `alignment.md`，需确认后推进：

- [ ] **预设合并策略**：预设包的命令/模板与项目自定义内容冲突时，如何处理？（覆盖/跳过/提示用户）
- [ ] **配置项范围**：是否需要支持更多配置项（如自定义命令目录、模板变量等）？
- [ ] **交互式体验范围**：是否所有命令都支持交互式模式，还是仅部分关键命令？