# SpecFlow 框架设计文档

## 1. 框架定位

### 1.1 核心理念

> **CLI 脚手架 + 斜杠命令 + AGENTS.md + 模板 = 即开即用的 Spec 驱动工作流**

SpecFlow 是一个极简的 Spec 驱动框架：
- **CLI 工具**：快速初始化项目结构，适配多种 AI 工具
- **斜杠命令**：6 个命令覆盖从需求到交付的完整流程
- **参考实现**：spec-kit 代码仓库（支持多种 AI 对接）

### 1.2 设计原则

| 原则          | 说明                                                         |
| ------------- | ------------------------------------------------------------ |
| **极简优先**  | 只有 6 个命令，CLI 只做初始化                                 |
| **即开即用**  | `specflow init` 一键初始化，立即可用                          |
| **多 AI 适配**| CLI 支持生成不同 AI 工具的命令文件（参考 spec-kit）           |
| **可定制**    | 通过修改模板和追加公共文档实现定制                            |

### 1.3 目标用户

| 阶段        | 用户群体          | 设计考量                         |
| ----------- | ----------------- | -------------------------------- |
| **Phase 1** | 个人开发者/研究者 | 简单配置、快速上手、单人工作流   |
| **Phase 2** | 团队协作          | 共享配置、对齐机制、并行执行     |
| **Phase 3** | 开源社区          | 配置市场、社区贡献、版本管理     |

---

## 2. 框架结构

### 2.1 目录结构

```
项目根目录/
├── .cursor/
│   └── commands/                 # 斜杠命令（6 个）
│       ├── flow.1-spec.md        # ★ 核心：规格撰写
│       ├── flow.2-plan.md        # ★ 核心：方案 + 任务拆解
│       ├── flow.3-execute.md     # ★ 核心：执行交付
│       ├── flow.accept.md        # 验收用例
│       ├── flow.align.md         # 对齐纠偏
│       └── flow.summary.md       # 总结沉淀
├── specflow/                     # 规格根目录
│   ├── AGENTS.md                 # 通用规则（AI 会读取）
│   ├── templates/                # 产出物模板（定制点）
│   │   ├── 1-spec.md
│   │   ├── 2-plan.md
│   │   ├── 3-tasks.md
│   │   ├── acceptance.md
│   │   ├── alignment.md
│   │   └── summary.md
│   └── <task_name>/              # 任务目录
│       ├── brief.md              # 需求描述
│       ├── assets/               # 辅助素材
│       ├── alignment.md          # 对齐记录（按需）
│       └── outputs/
│           ├── 1-spec.md
│           ├── 2-plan.md
│           ├── 3-tasks.md
│           ├── acceptance.md     # 可选
│           └── summary.md        # 可选
```

### 2.2 命令体系

| 命令 | 类型 | 职责 | 产出 |
| --- | --- | --- | --- |
| `/flow.1-spec` | ★ 核心 | 规格撰写 | `1-spec.md` |
| `/flow.2-plan` | ★ 核心 | 方案 + 任务拆解 | `2-plan.md`、`3-tasks.md` |
| `/flow.3-execute` | ★ 核心 | 执行交付 | 更新勾选状态 |
| `/flow.accept` | 辅助 | 验收用例 | `acceptance.md` |
| `/flow.align` | 辅助 | 对齐纠偏 | `alignment.md` |
| `/flow.summary` | 辅助 | 总结沉淀 | `summary.md` |

#### 命令命名规范

- **核心三环节**：`flow.1-spec` → `flow.2-plan` → `flow.3-execute`，数字前缀表示主流程顺序
- **辅助命令**：无数字前缀，表示按需使用

---

## 3. 定制方式

SpecFlow 只支持两种定制方式，保持极简：

### 3.1 修改模板（templates/）

模板决定产出物的结构和格式。修改 `specflow/templates/*.md` 即可定制：

| 模板文件 | 作用 |
| --- | --- |
| `1-spec.md` | 规格文档结构（用户故事、需求、成功标准等） |
| `2-plan.md` | 技术方案结构 |
| `3-tasks.md` | 任务清单格式 |
| `acceptance.md` | 验收用例格式 |
| `alignment.md` | 对齐记录格式 |
| `summary.md` | 总结文档格式 |

### 3.2 追加公共文档

AI 会读取的公共文档可用于追加规则：

| 文档 | 作用 |
| --- | --- |
| `specflow/AGENTS.md` | 通用规则（强制规则、产物约定、对齐格式等） |
| 任务级 `_agents.md` | 任务特定规则（可选） |

**追加规则示例**：

在 `AGENTS.md` 中追加：

```markdown
## 额外规则

- 每个用户故事必须包含 Given-When-Then 格式的验收场景
- 任务清单使用 Phase 结构（Setup → Core → Polish）
```

---

## 4. 核心工作流

### 4.1 标准流程

```
specflow init → 初始化项目结构
        ↓
brief.md → /flow.1-spec → 1-spec.md
                ↓
         /flow.2-plan → 2-plan.md + 3-tasks.md
                ↓
         /flow.3-execute → 更新勾选状态
                ↓
         /flow.summary → summary.md
```

### 4.2 对齐机制

当出现 **冲突 / 缺失 / 歧义 / 偏差** 时：

1. 使用 `/flow.align` 追加到 `alignment.md`
2. 同步更新受影响的 outputs
3. 在 `alignment.md` 中标记 `[已确认]` 结论

### 4.3 输入优先级

```
alignment.md > brief.md > assets/* > 现状
```

---

## 5. CLI 工具

### 5.1 核心能力

| 命令 | 功能 | 说明 |
| --- | --- | --- |
| `specflow init` | 初始化项目 | 创建目录结构、模板、AGENTS.md |
| `specflow init --ai <tool>` | 适配指定 AI | 生成对应 AI 工具的命令文件 |
| `specflow new` | 创建任务目录 | 创建 `YYYYMMDD-待命名/` 壳子文件夹 |

### 5.2 new 命令详解

```bash
specflow new
# 创建: specflow/20260119-待命名/
#       ├── brief.md          # 空文件
#       ├── assets/           # 空目录
#       └── outputs/          # 空目录

specflow new "用户认证功能"
# 创建: specflow/20260119-用户认证功能/
```

目录结构：
```
specflow/YYYYMMDD-<名称>/
├── brief.md              # 需求描述（空文件，待填写）
├── assets/               # 辅助素材（空目录）
└── outputs/              # 产出物目录（空目录）
```

### 5.3 支持的 AI 工具

| AI 工具 | 命令目录 | 说明 |
| --- | --- | --- |
| Cursor | `.cursor/commands/` | 默认 |
| Claude | `.claude/commands/` | 待实现 |
| GitHub Copilot | `.github/copilot/` | 待实现 |
| 其他 | 自定义 | 可扩展 |

### 5.4 参考实现

> **spec-kit 代码仓库**可作为参考实现，其支持多种 AI 工具对接的设计值得借鉴。

---

## 6. 实施路线图

### Phase 1：个人使用（MVP）—— 当前阶段

**交付物**：
- [ ] `specflow` CLI 工具（init 命令）
- [ ] `specflow/AGENTS.md` - 通用规则
- [ ] `specflow/templates/` - 6 个产出物模板
- [ ] `.cursor/commands/flow.*.md` - 6 个斜杠命令

### Phase 2：多 AI 适配

- [ ] 支持 Claude 命令格式
- [ ] 支持 GitHub Copilot 命令格式
- [ ] 配置版本管理

### Phase 3：开源社区

- [ ] 配置市场
- [ ] 配置验证工具
- [ ] 文档和教程

---

## 7. 总结

SpecFlow 的核心价值：

1. **极简**：6 个命令 + 1 个 AGENTS.md + 6 个模板
2. **即开即用**：`specflow init` 一键初始化
3. **核心三环节**：`flow.1-spec` → `flow.2-plan` → `flow.3-execute`
4. **可定制**：修改模板 + 追加公共文档
5. **多 AI 适配**：CLI 支持生成不同 AI 工具的命令文件

**不包含**：
- ❌ 复杂的 YAML 配置
- ❌ 领域配置市场
- ❌ 分层架构设计
