# AGENTS (Generic)

本文档定义 Spec Flow 流水线的**通用规范**，供各 AI 工具的 slash commands 或 `<specs_dir>/` 下的命令统一引用，避免在每个 command 里重复"目录约定/通用规则"。

---

## 1. 总览（Quick Reference）

### 1.1 变量定义

| 变量           | 值         | 说明       |
| -------------- | ---------- | ---------- |
| `<cmd_prefix>` | `spec`     | 命令前缀   |
| `<specs_dir>`  | `specflow` | 规格根目录 |
| `<task_name>`  | -          | 任务名称   |

### 1.2 命令速查

| 命令                      | 职责            | 输出                     |
| ------------------------- | --------------- | ------------------------ |
| `/<cmd_prefix>.1-spec`    | 规格撰写        | `1-spec.md`              |
| `/<cmd_prefix>.2-plan`    | 方案 + 任务拆解 | `2-plan.md` `3-tasks.md` |
| `/<cmd_prefix>.3-execute` | 执行交付        | 更新勾选状态             |
| `/<cmd_prefix>.accept`    | 验收用例        | `acceptance.md`          |
| `/<cmd_prefix>.align`     | 对齐纠偏        | `alignment.md`           |
| `/<cmd_prefix>.summary`   | 总结沉淀        | `summary.md`             |

---

## 2. 结构（Architecture）

### 2.1 目录结构

```
<specs_dir>/
├── AGENTS.md                    # 本文件
├── templates/                   # 输出模板（定制这里）
│   ├── 1-spec.md
│   ├── 2-plan.md
│   ├── 3-tasks.md
│   ├── acceptance.md
│   ├── alignment.md
│   └── summary.md
└── <task_name>/                 # 任务目录
    ├── brief.md / prd.md        # 需求描述（二选一）
    ├── assets/                  # 辅助素材
    ├── alignment.md             # 对齐记录（按需）
    └── outputs/
        ├── 1-spec.md
        ├── 2-plan.md
        ├── 3-tasks.md
        ├── acceptance.md        # 可选
        └── summary.md           # 可选
```

### 2.2 输入优先级

```
alignment.md > brief.md / prd.md > assets/* > 现状
```

---

## 3. 规则（Rules）

### 3.1 对齐与变更传播

【**IMPORTANT!!!**】对齐是贯穿整个流程的核心机制。发现问题 → 记录对齐 → 传播变更。

#### 触发时机

**任何阶段**发现问题都必须追加到 `alignment.md`（不限于 `/<cmd_prefix>.align` 命令）：

| 阶段        | 触发场景             |
| ----------- | -------------------- |
| `1-spec`    | 需求冲突、歧义、缺失 |
| `2-plan`    | 口径不一致、方案风险 |
| `3-execute` | 实现偏差、阻塞问题   |
| `accept`    | 验收标准不明确       |
| `summary`   | 遗漏的决策点         |

#### 写入格式

参考 `<specs_dir>/templates/alignment.md`，使用标准标签：

| 标签       | 含义                 |
| ---------- | -------------------- |
| `[冲突]`   | 多来源信息存在矛盾   |
| `[缺失]`   | 缺少必要信息         |
| `[歧义]`   | 描述模糊可作多种理解 |
| `[偏差]`   | 实现与预期不符       |
| `[待确认]` | 需要相关方确认       |
| `[已确认]` | 已获确认结论         |

#### 变更传播

口径变化时必须同步更新：

1. `1-spec.md`
2. `2-plan.md` / `3-tasks.md`
3. `acceptance.md`（若存在）

### 3.2 任务状态

【**IMPORTANT!!!**】每完成一个任务**立即更新状态**，以支持断点续执行。

执行阶段（`/<cmd_prefix>.3-execute`）：

- 完成：`- [ ]` → `- [x]`（完成后立即勾选，不要等全部完成）
- 新增：追加到 `3-tasks.md`
- 阻塞：标注阻塞原因，追加到 `alignment.md`

### 3.3 输出模板映射

| 产物            | 模板                                  | 关联命令                |
| --------------- | ------------------------------------- | ----------------------- |
| `1-spec.md`     | `<specs_dir>/templates/1-spec.md`     | `/<cmd_prefix>.1-spec`  |
| `2-plan.md`     | `<specs_dir>/templates/2-plan.md`     | `/<cmd_prefix>.2-plan`  |
| `3-tasks.md`    | `<specs_dir>/templates/3-tasks.md`    | `/<cmd_prefix>.2-plan`  |
| `acceptance.md` | `<specs_dir>/templates/acceptance.md` | `/<cmd_prefix>.accept`  |
| `alignment.md`  | `<specs_dir>/templates/alignment.md`  | `/<cmd_prefix>.align`   |
| `summary.md`    | `<specs_dir>/templates/summary.md`    | `/<cmd_prefix>.summary` |

**模板优先级**：

```
templates/*.md（若存在） > commands 内嵌默认模板
```

- **开箱即用**：每个 command 内嵌了默认模板结构，无需额外配置
- **可定制**：在 `<specs_dir>/templates/` 下创建同名文件即可覆盖默认结构

---

## 4. 定制（Customization）

| 我想要...  | 改什么                         |
| ---------- | ------------------------------ |
| 改输出格式 | `<specs_dir>/templates/*.md`   |
| 改核心规则 | 本文件（AGENTS.md）            |
| 加新命令   | `.cursor/commands/` 下新建文件 |
| 增强工作流 | 追加到 `AGENTS.md`             |
