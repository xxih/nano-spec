# 规格说明：提供配置等更多能力

## 背景与目标

### 背景

当前 `nano-spec` 项目已实现基础功能：
- ✅ 项目初始化（`nanospec init`）
- ✅ 创建任务目录（`nanospec new`）
- ✅ 基础适配器系统（支持 Cursor、iFlow、Qwen、Cline）
- ✅ 基础命令模板（spec.1-spec、spec.2-plan、spec.3-execute、spec.accept、spec.align、spec.summary）

但根据 `brief.md` 中的通用方案定义，项目仍缺少以下关键能力：
1. **任务切换与断点续作**：当前无"当前任务指针"机制
2. **配置系统**：无多级配置支持（用户级/项目级/默认级）
3. **预设包系统**：无领域化增强能力（如前端/后端/重构等预设包）
4. **交互式体验**：部分命令缺乏交互式引导
5. **模板系统**：无变量替换与渲染能力

### 目标

为 `nano-spec` 提供配置、预设包、任务管理等更多能力，使其成为一个完整的 Spec-Driven 开发框架。

---

## 核心组成

```
nano-spec 增强能力
├── 1. 配置系统
│   ├── 配置文件格式（TOML/JSON/YAML）
│   ├── 多级配置优先级（项目级 > 用户级 > 默认级）
│   └── 配置项：规格根目录、命令前缀、默认工具等
│
├── 2. 任务管理
│   ├── 当前任务指针（.nanospec/current-task）
│   ├── 任务切换命令（nanospec switch）
│   └── 查看当前任务（nanospec current）
│
├── 3. 预设包系统
│   ├── 预设包结构（预设规则 + 额外命令）
│   ├── 预设包安装命令（nanospec preset install）
│   ├── 内置预设示例（前端/后端/重构/文档）
│   └── 预设包管理列表/卸载
│
├── 4. 模板系统
│   ├── 变量占位符（{{specs_root}}、{{cmd_prefix}} 等）
│   ├── 模板渲染引擎
│   └── 动态生成命令/文档
│
└── 5. 交互式体验
    ├── 工具选择（多选、带默认）
    ├── 任务选择（单选、分页）
    └── 配置级别选择（用户级/项目级）
```

---

## 成功标志

### 1. 配置系统

- [x] 支持项目级配置文件（`nanospec.config.toml`）
- [x] 支持用户级配置文件（`~/.nanospec/config.toml`）
- [x] 配置优先级正确：项目级 > 用户级 > 默认级
- [x] 可配置项包括：
  - `specs_root`：规格根目录名称（默认 `nanospec`）
  - `cmd_prefix`：命令前缀（默认 `spec`）
  - `default_ai`：默认 AI 工具（默认 `cursor`）
  - `date_format`：任务日期格式（默认 `YYYYMMDD`）

### 2. 任务管理

- [x] `nanospec switch` 命令：交互式选择或指定任务名
- [x] `nanospec current` 命令：显示当前激活任务信息
- [x] 当前任务指针文件：`.nanospec/current-task`
- [x] 所有命令默认读取当前任务指针，无需重复指定

### 3. 预设包系统

- [x] 预设包目录结构：`nanospec/presets/<preset-name>/`
- [x] 预设包内容：
  - `rules.md`：追加到通用规范中的领域规则
  - `commands/`：额外命令模板
- [x] `nanospec preset install <name>`：安装预设包
- [x] `nanospec preset list`：列出可用预设
- [x] `nanospec preset uninstall <name>`：卸载预设包
- [x] 内置预设示例：
  - `frontend`：前端特化（交互/状态/组件规范）
  - `backend`：后端开发（API/数据模型/服务架构）
  - `refactor`：重构优化（评审与风险控制）
  - `docs`：文档写作（信息架构/受众分析）

### 4. 模板系统

- [x] 支持变量占位符：`{{specs_root}}`、`{{cmd_prefix}}`、`{{task_name}}`
- [x] 模板渲染引擎：替换占位符为实际值
- [x] 应用场景：命令模板生成、任务文档生成

### 5. 交互式体验

- [x] `nanospec init --interactive`：交互式初始化
  - 选择 AI 工具（多选、带默认）
  - 选择配置级别（用户级/项目级）
- [x] `nanospec switch --interactive`：交互式任务切换
  - 分页显示任务列表
  - 单选确认

---

## 约束与注意

### 必须遵守的限制条件

- [ ] **风格/规范**：
  - TypeScript 代码风格与现有代码一致（使用 `import`、`export`、类型注解）
  - 命令行输出使用 emoji 图标（✓、⚠️、❌、🎉）
  - 错误信息清晰、可操作

- [ ] **依赖项**：
  - 使用现有依赖：`commander`（CLI 框架）
  - 新增依赖（如需）：
    - `inquirer`：交互式命令行界面
    - `toml`：TOML 配置文件解析
    - `handlebars` 或 `mustache`：模板渲染（可选，也可自实现简单替换）

- [ ] **向后兼容**：
  - 现有命令行为不变（`nanospec init`、`nanospec new`）
  - 新功能通过新命令或可选参数提供
  - 配置项提供合理的默认值

- [ ] **测试覆盖**：
  - 新增命令必须有单元测试
  - 配置系统测试多级优先级
  - 预设包系统测试安装/卸载流程

- [ ] **文档更新**：
  - 更新 `README.md`，说明新功能
  - 更新 `AGENTS.md`，反映新的目录结构和命令
  - 提供预设包开发指南

- [ ] **跨平台兼容**：
  - 配置文件路径兼容 Windows/macOS/Linux
  - 使用 `path.join` 和 `os.homedir()` 处理路径