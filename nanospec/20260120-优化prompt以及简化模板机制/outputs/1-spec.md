# 规格说明：优化 prompt 以及简化模板机制

## 背景与目标

当前 Nano Spec 系统存在以下问题：

1. **Cursor 产物格式错误**：Cursor 生成的产物仅简单地将 TOML 文本复制到 MD 文档中，格式不匹配，不符合预期输出要求
2. **模板机制复杂**：需要优化现有模板机制，使其更加灵活
3. **prompt 需要优化**：现有的 prompt 结构需要改进以获得更好的 AI 生成结果

**目标**：

- 优化所有命令的 prompt，确保 AI 能够生成符合要求的输出格式
- 简化模板机制，将其变为可选功能
- 所有命令默认内嵌模板结构，同时支持通过 `templates/` 目录进行定制
- 以新提供的"核心 prompt"为基准，统一所有产物的生成标准

## 核心组成

```
nanospec/
├── AGENTS.md                          # 通用规范文档（基准）
├── templates/                         # 可选的输出产物模板定制目录
│   ├── 1-spec.md                      # 可选的规格说明模板
│   ├── 2-plan.md                      # 可选的方案说明模板
│   ├── 3-tasks.md                     # 可选的任务清单模板
│   ├── acceptance.md                  # 可选的验收用例模板
│   ├── alignment.md                   # 可选的对齐记录模板
│   └── summary.md                     # 可选的总结沉淀模板
└── <task_name>/                       # 任务目录
    ├── brief.md
    ├── assets/
    ├── alignment.md
    └── outputs/
        ├── 1-spec.md
        ├── 2-plan.md
        ├── 3-tasks.md
        ├── acceptance.md
        └── summary.md
```

**核心组件**：

1. **AGENTS.md** - 定义通用规范、目录结构、规则和定制方式（位于 nanospec/ 根目录）
2. **核心 prompt** - 六个命令的完整 prompt 定义（flow.1-spec, flow.2-plan, flow.3-execute, flow.accept, flow.align, flow.summary），内嵌在各自的 TOML 配置文件中
3. **模板机制** - 可选的输出产物定制层，仅用于存放 outputs/_.md 模板文件，优先级：`templates/_.md`>`commands 内嵌默认模板`

## 核心原则

1. **开箱即用**：所有命令必须内嵌完整的默认模板结构，无需额外配置即可使用
2. **模板可选**：`templates/` 目录及其内容为可选，不存在时使用内嵌默认模板
3. **优先级明确**：存在定制模板时，定制模板优先于内嵌默认模板
4. **基准统一**：所有 prompt 和模板以 `assets/核心prompt/` 目录下提供的文件为唯一基准
5. **格式正确**：确保 AI 生成的产物格式符合预期，特别是 Markdown 格式而非 TOML 文本
6. **向后兼容**：保持与现有任务结构和文件路径的兼容性

## 成功标志

### 1. Prompt 优化

- [ ] 所有六个命令（flow.1-spec, flow.2-plan, flow.3-execute, flow.accept, flow.align, flow.summary）的 prompt 已按照"核心 prompt"优化
- [ ] Prompt 结构清晰，包含 Role、Objective、Inputs、Rules、Output、Checklist 等完整部分
- [ ] Prompt 引用 `AGENTS.md` 通用规范，避免重复定义

### 2. 模板机制简化

- [ ] 每个命令的 TOML 配置文件内嵌完整的默认 prompt（包含模板结构）
- [ ] `templates/` 目录为可选，不存在时不影响命令执行
- [ ] `templates/` 目录仅包含输出产物模板文件（1-spec.md、2-plan.md、3-tasks.md、acceptance.md、alignment.md、summary.md）
- [ ] 存在 `templates/` 时，定制模板优先于内嵌默认模板
- [ ] 模板优先级规则在 `AGENTS.md` 中明确定义

### 3. 产物格式正确

- [ ] AI 生成的 `1-spec.md`、`2-plan.md`、`3-tasks.md` 等文件是标准 Markdown 格式
- [ ] 产物不再包含 TOML 配置文本
- [ ] 产物结构与模板定义一致

### 4. 文档一致性

- [ ] `.iflow/commands/` 下的 TOML 文件已更新，内嵌完整的默认 prompt
- [ ] `nanospec/AGENTS.md` 已更新为最新版本（包含总览、结构、规则、定制等完整章节）
- [ ] `templates/` 目录（若存在）仅包含输出产物模板文件
- [ ] 所有文档引用路径正确

### 5. 验收标准

- [ ] 使用优化后的 prompt 执行 `/flow.1-spec` 命令，生成的 `1-spec.md` 格式正确
- [ ] 使用优化后的 prompt 执行 `/flow.2-plan` 命令，生成的 `2-plan.md` 和 `3-tasks.md` 格式正确
- [ ] 不存在 `templates/` 目录时，命令仍能正常执行并使用内嵌默认模板
- [ ] 存在 `templates/` 定制时（仅包含输出产物模板），命令使用定制模板而非内嵌默认模板
- [ ] `templates/` 目录不包含 commands 和 AGENTS.md 文件
