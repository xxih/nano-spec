# 方案：nano-spec 配置系统与增强能力实施方案

## 方案概述

本方案在现有 `nano-spec` 架构基础上，通过模块化扩展实现配置管理、预设包系统、任务记忆和交互式体验。核心策略：

1. **配置系统**：引入 `cosmiconfig` 库实现多级配置解析，保持向后兼容
2. **预设包**：设计预设包目录结构，通过 `preset` 命令管理预设生命周期
3. **任务记忆**：通过 `.nanospec/current-task` 文件持久化当前任务指针
4. **交互式体验**：引入 `inquirer` 库实现交互式向导（参考 OpenSpec）
5. **命令同步**：增强现有 adapter 系统，支持增量同步
6. **AI 工具扩展**：新增 4 个主流 AI 工具适配器（Claude Code、GitHub Copilot、Windsurf、Kilo Code）

所有变更保持现有架构风格，不破坏向后兼容性。

---

## 决策协议

### 情况 A：涉及代码/工程实施 (Coding Task)

> **特征**：需要修改代码、配置、脚本，或需要遵循现有项目架构。
> **动作**：🔴 **严禁跳过 Plan**。即使 Spec 很详细，也需要明确如何在代码中落地。

### 情况 B：纯内容创作/文档类 (Content/Writing Task)

> **特征**：输出仅为 Markdown 文档、文案，不涉及代码逻辑，且 Spec 已包含详细大纲。注意！若判断任务相对复杂，需要在 Plan 中进行更详尽的分析，也不允许启用 "透传模式"。
> **动作**：🟢 **启用 "透传模式" (Passthrough)**。
> **硬性约束（必须遵守）：**
> + outputs/2-plan.md 最多 3 行（含标题行），不得包含"详细执行方案/分点/步骤/风险/验收/里程碑"等任何扩写。
> + 所有后续方案优化、结构调整、补充细节：一律回写到 outputs/1-spec.md（或 alignment.md 若属于待确认项），不得在 plan 展开。

**本任务属于情况 A（Coding Task）**，因此需要详细的实施方案。

---

## 详细执行方案

### 1. 配置系统实现

#### 1.1 配置解析模块
**文件**：`src/config/config.ts`

**职责**：
- 使用 `cosmiconfig` 加载配置（支持 `.nanospecrc`、`nanospec.config.js` 等）
- 合并多级配置（项目级 > 用户级 > 默认）
- 提供配置验证和默认值

**接口设计**：
```typescript
interface NanospecConfig {
  specs_root?: string;
  cmd_prefix?: string;
  default_adapter?: string;
  template_format?: 'md' | 'toml' | 'json';
  auto_sync?: boolean;
}

export async function loadConfig(cwd: string): Promise<NanospecConfig>
export function getDefaultConfig(): NanospecConfig
```

**默认配置**：
```typescript
const DEFAULT_CONFIG: NanospecConfig = {
  specs_root: 'nanospec',
  cmd_prefix: 'spec',
  default_adapter: 'cursor',
  template_format: 'md',
  auto_sync: true,
};
```

#### 1.2 集成到现有命令
**修改文件**：`src/commands/init.ts`、`src/commands/new.ts`

**变更点**：
- `init` 命令：读取 `default_adapter` 配置，无需 `--ai` 参数时使用默认值
- `new` 命令：读取 `specs_root` 配置，确定任务目录位置

---

### 2. 预设包系统实现

#### 2.1 预设包结构
**目录**：`src/presets/` → `dist/presets/`

**预设包示例**（`frontend`）：
```
src/presets/frontend/
├── preset.json          # 元数据
├── commands/            # 追加的命令模板
│   └── spec.clarify.md
└── templates/           # 追加的输出模板
    └── 1-spec.md
```

**preset.json 格式**：
```json
{
  "name": "frontend",
  "version": "1.0.0",
  "description": "前端开发特化预设",
  "commands": ["spec.clarify"],
  "templates": ["1-spec"],
  "extends": "AGENTS.md"  // 追加内容到 AGENTS.md
}
```

#### 2.2 预设管理命令
**新增文件**：`src/commands/preset.ts`

**命令**：
- `nanospec preset list`：列出所有内置预设
- `nanospec preset install <name>`：安装预设到当前项目
- `nanospec preset uninstall <name>`：卸载预设

**实现逻辑**：
```typescript
export async function listPresets(): Promise<void>
export async function installPreset(name: string, cwd: string): Promise<void>
export async function uninstallPreset(name: string, cwd: string): Promise<void>
```

**安装流程**：
1. 读取预设包的 `preset.json`
2. 将 `commands/` 下的文件复制到 `.iflow/commands/`（冲突时提示用户）
3. 将 `templates/` 下的文件复制到 `nanospec/templates/`（冲突时提示用户）
4. 将 `extends` 内容追加到 `nanospec/AGENTS.md`

#### 2.3 内置预设内容
**创建文件**：
- `src/presets/frontend/preset.json`
- `src/presets/backend/preset.json`
- `src/presets/refactor/preset.json`
- `src/presets/docs/preset.json`

---

### 3. 任务记忆与断点续作实现

#### 3.1 任务指针管理
**新增文件**：`src/config/task-pointer.ts`

**职责**：
- 读写 `.nanospec/current-task` 文件
- 提供任务切换和查询接口

**接口设计**：
```typescript
export function getCurrentTask(cwd: string): string | null
export function setCurrentTask(cwd: string, taskName: string): void
export function clearCurrentTask(cwd: string): void
```

#### 3.2 集成到现有命令
**修改文件**：`src/commands/new.ts`

**变更点**：
- 创建任务后自动调用 `setCurrentTask()` 设置为当前任务（无需手动 switch）

**新增文件**：`src/commands/switch.ts`

**命令**：`nanospec switch [name]`

**功能**：
- 有参数：切换到指定任务
- 无参数：交互式选择任务（列出所有任务目录，避免手动输入完整任务名）
- 更新 `.nanospec/current-task`

**新增文件**：`src/commands/status.ts`

**命令**：`nanospec status`

**功能**：
- 显示当前激活任务信息
- 显示任务目录路径
- 显示任务状态（brief.md、outputs/1-spec.md 等是否存在）

---

### 4. 交互式体验实现

#### 4.1 引入交互式库
**依赖**：`inquirer`

**用途**：
- 工具选择（多选）
- 任务选择（单选）
- 配置向导
- 确认提示

#### 4.2 交互式命令增强
**修改文件**：`src/commands/init.ts`

**变更点**：
- 添加 `--interactive` / `-i` 选项（参考 OpenSpec 的交互式初始化体验）
- 启动交互式向导，引导用户：
  1. 选择 AI 工具（多选，支持 Claude Code、GitHub Copilot、Windsurf、Kilo Code 等主流工具）
  2. 配置 `specs_root`、`cmd_prefix` 等参数
  3. 生成配置文件

**新增交互逻辑**：
```typescript
export async function interactiveInit(options: InitOptions): Promise<void>
```

**修改文件**：`src/commands/switch.ts`

**变更点**：
- 无参数时使用 `inquirer` 显示任务列表供选择（避免手动输入完整任务名）

**修改文件**：`src/commands/preset.ts`

**变更点**：
- 无参数时使用 `inquirer` 显示预设列表供选择

---

### 5. 命令同步增强

#### 5.1 同步命令
**新增文件**：`src/commands/sync.ts`

**命令**：`nanospec sync [--adapter <name>]`

**功能**：
- 将项目内的命令/模板同步到各 AI 工具目录
- 支持指定目标工具
- 增量同步（仅更新内容变化的文件）

**实现逻辑**：
```typescript
export async function syncCommands(options: SyncOptions): Promise<void>
```

#### 5.2 增强 adapter 系统
**修改文件**：`src/adapters/index.ts`

**变更点**：
- 在 `AIAdapter` 接口添加 `incrementalSync` 方法
- 实现增量同步逻辑（比较文件哈希或修改时间）

---

### 6. AI 工具适配器扩展

#### 6.1 新增适配器
**新增文件**：
- `src/adapters/claude-code.ts`
- `src/adapters/copilot.ts`
- `src/adapters/windsurf.ts`
- `src/adapters/kilo-code.ts`

**适配器说明**：

1. **Claude Code**（claude-code.ts）
   - 工具：Anthropic 的命令行代理
   - 命令目录：`.claude/commands/`
   - 文件格式：Markdown
   - 特点：支持变量替换，需要处理 Claude Code 特定的命令格式

2. **GitHub Copilot**（copilot.ts）
   - 工具：GitHub Copilot（VS Code 扩展）
   - 命令目录：`.github/copilot/commands/`
   - 文件格式：Markdown
   - 特点：需要适配 Copilot Chat 的命令格式

3. **Windsurf**（windsurf.ts）
   - 工具：Windsurf AI 原生编辑器
   - 命令目录：`.windsurf/commands/`
   - 文件格式：Markdown
   - 特点：支持 Windsurf 特定的命令格式和变量

4. **Kilo Code**（kilo-code.ts）
   - 工具：Kilo Code AI 原生编辑器
   - 命令目录：`.kilo/commands/`
   - 文件格式：Markdown
   - 特点：需要适配 Kilo Code 的命令格式

#### 6.2 注册新适配器
**修改文件**：`src/adapters/index.ts`

**变更点**：
- 导入新适配器模块
- 在 `adapters` 对象中注册新适配器
- 更新 `listAdapters()` 返回值，包含所有 8 个适配器

**新增代码**：
```typescript
import { claudeCodeAdapter } from './claude-code.js';
import { copilotAdapter } from './copilot.js';
import { windsurfAdapter } from './windsurf.js';
import { kiloCodeAdapter } from './kilo-code.js';

const adapters: Record<string, AIAdapter> = {
  cursor: cursorAdapter,
  qwen: qwenAdapter,
  iflow: iflowAdapter,
  cline: clineAdapter,
  'claude-code': claudeCodeAdapter,
  copilot: copilotAdapter,
  windsurf: windsurfAdapter,
  'kilo-code': kiloCodeAdapter,
};
```

#### 6.3 交互式工具选择
**修改文件**：`src/commands/init.ts`

**变更点**：
- 在交互式向导中，工具选择列表包含所有 8 个适配器
- 提供工具描述，帮助用户选择
- 支持多选（用户可以选择多个 AI 工具）

**工具选择示例**：
```typescript
{
  type: 'checkbox',
  name: 'adapters',
  message: '选择要支持的 AI 工具（可多选）：',
  choices: [
    { name: 'Claude Code', value: 'claude-code', checked: true },
    { name: 'Cursor', value: 'cursor', checked: true },
    { name: 'GitHub Copilot', value: 'copilot' },
    { name: 'Windsurf', value: 'windsurf' },
    { name: 'Kilo Code', value: 'kilo-code' },
    { name: 'iFlow', value: 'iflow' },
    { name: 'Qwen', value: 'qwen' },
    { name: 'Cline', value: 'cline' },
  ],
}
```

#### 6.4 测试新适配器
**新增文件**：
- `src/adapters/claude-code.test.ts`
- `src/adapters/copilot.test.ts`
- `src/adapters/windsurf.test.ts`
- `src/adapters/kilo-code.test.ts`

**测试内容**：
- 适配器配置验证
- 命令生成逻辑
- 格式转换功能（如有）
- 文件写入路径正确性

---

### 7. 测试与文档

#### 7.1 单元测试
**新增/修改文件**：
- `src/config/config.test.ts`
- `src/config/task-pointer.test.ts`
- `src/commands/preset.test.ts`
- `src/commands/switch.test.ts`
- `src/commands/sync.test.ts`
- `src/adapters/claude-code.test.ts`
- `src/adapters/copilot.test.ts`
- `src/adapters/windsurf.test.ts`
- `src/adapters/kilo-code.test.ts`

#### 7.2 文档更新
**修改文件**：`README.md`

**新增内容**：
- 配置系统说明
- 预设包使用指南
- 任务记忆与断点续作说明
- 交互式命令说明
- 支持的 AI 工具列表（8 个）

---

## 技术选型

| 功能 | 库/技术 | 说明 |
|------|---------|------|
| 配置解析 | `cosmiconfig` | 支持多格式配置文件 |
| 交互式体验 | `inquirer` | 命令行交互式提示 |
| 文件操作 | Node.js `fs`/`path` | 内置模块 |
| CLI 框架 | `commander` | 现有依赖 |

---

## 10. CLI 命令增强

### 10.1 init CLI 命令默认交互式

**变更点**：
- 移除 `--interactive` 参数
- 默认行为就是交互式向导
- 保留 `--ai` 参数用于直接指定 AI 工具（非交互式快速初始化）
- 保留 `--force` 参数用于强制覆盖

**实现逻辑**：
```typescript
export async function init(options: InitOptions): Promise<void> {
  const cwd = process.cwd();

  // 如果指定了 AI 工具，使用非交互式快速初始化
  if (options.ai) {
    await quickInit(options);
    return;
  }

  // 默认使用交互式向导
  await interactiveInit(options);
}
```

### 10.2 config CLI 命令

**命令结构**：
```bash
nanospec config                    # 查看当前配置
nanospec config get <key>          # 获取配置值
nanospec config set <key> <value>  # 设置配置
nanospec config unset <key>        # 删除配置项
nanospec config --list             # 列出所有配置项
nanospec config --global           # 操作全局配置
```

**实现逻辑**：
```typescript
interface ConfigOptions {
  global?: boolean;
  list?: boolean;
}

export async function config(
  action?: 'get' | 'set' | 'unset',
  key?: string,
  value?: string,
  options: ConfigOptions = {}
): Promise<void> {
  const cwd = process.cwd();
  const configPath = options.global
    ? join(os.homedir(), '.nanospecrc')
    : join(cwd, '.nanospec', 'config.json');

  // 根据参数执行不同操作
  if (options.list) {
    await listConfig(configPath);
  } else if (action === 'get' && key) {
    await getConfig(configPath, key);
  } else if (action === 'set' && key && value) {
    await setConfig(configPath, key, value);
  } else if (action === 'unset' && key) {
    await unsetConfig(configPath, key);
  } else {
    await showCurrentConfig(configPath);
  }
}
```

**配置文件格式**：
```json
{
  "specs_root": "nanospec",
  "cmd_prefix": "spec",
  "default_adapter": "cursor",
  "template_format": "md",
  "auto_sync": true
}
```

---

## 风险与应对

| 风险 | 应对措施 |
|------|----------|
| 配置解析失败 | 提供默认配置，显示警告 |
| 预设冲突 | 交互式询问用户选择（覆盖/跳过） |
| 任务指针损坏 | 提供恢复机制，重新扫描任务目录 |
| 依赖增加 | 评估 `cosmiconfig` 和 `inquirer` 的必要性 |

---

## 里程碑

1. **配置系统**：实现配置解析和集成（1-2 天）
2. **预设包**：实现预设管理命令和内置预设（2-3 天）
3. **任务记忆**：实现任务指针和 switch/status 命令（1 天）
4. **交互式体验**：实现交互式向导（1-2 天）
5. **AI 工具扩展**：实现 4 个新适配器（Claude Code、GitHub Copilot、Windsurf、Kilo Code）（2-3 天）
6. **命令同步**：实现 sync 命令和增量同步（1 天）
7. **测试与文档**：编写测试和更新文档（2-3 天）

**总计**：10-15 天