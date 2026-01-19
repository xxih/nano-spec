# AGENTS (Generic)

## 变量

| 变量           | 值         | 说明       |
| -------------- | ---------- | ---------- |
| `<cmd_prefix>` | `flow`     | 命令前缀   |
| `<specs_dir>`  | `specflow` | 规格根目录 |
| `<task_name>`  | -          | 任务名称   |

---

## 0. 强制规则

- 若有待澄清项、冲突、缺失、歧义、偏差等等。统一追加到 `alignment.md` 待用户给出进一步确认。
- 默认不创建 `alignment.md`。在流程中任一环节，有需要则创建并追加。
- 只有当发现：**冲突 / 缺失 / 歧义 / 偏差** 时，才创建或追加。
- 若 `alignment.md` 已存在：其 `[已确认]` 结论优先级最高。
- 每次编辑 `alignment.md` 前需仔细确认该文件是否存在，请仔细阅读该文件，要求只能追加！禁止直接覆盖写入该文件。

---

## 1. 目录结构

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
    ├── brief.md                 # 需求描述
    ├── assets/                  # 辅助素材
    ├── alignment.md             # 对齐记录（按需）
    └── outputs/
        ├── 1-spec.md
        ├── 2-plan.md
        ├── 3-tasks.md
        ├── acceptance.md        # 可选
        └── summary-*.md         # 可选
```

---

## 2. 输入优先级

```
alignment.md > brief.md / prd.md > assets/* > 现状
```

---

## 3. 输出参考模板

| 产物            | 模板                                  | 关联命令                |
| --------------- | ------------------------------------- | ----------------------- |
| `1-spec.md`     | `<specs_dir>/templates/1-spec.md`     | `/<cmd_prefix>.1-spec`  |
| `2-plan.md`     | `<specs_dir>/templates/2-plan.md`     | `/<cmd_prefix>.2-plan`  |
| `3-tasks.md`    | `<specs_dir>/templates/3-tasks.md`    | `/<cmd_prefix>.2-plan`  |
| `acceptance.md` | `<specs_dir>/templates/acceptance.md` | `/<cmd_prefix>.accept`  |
| `alignment.md`  | `<specs_dir>/templates/alignment.md`  | `/<cmd_prefix>.align`   |
| `summary-*.md`  | `<specs_dir>/templates/summary.md`    | `/<cmd_prefix>.summary` |

---

## 4. 变更传播

【**IMPORTANT!!! 重要!!!**】每个阶段，变更若对其他产物有影响，则需要传播变更。尤其是 align 的过程中，一定要传播变更！！

口径变化时必须同步更新：

1. `1-spec.md`
2. `2-plan.md` / `3-tasks.md`
3. `acceptance.md`（若存在）

---

## 5. 任务状态

执行阶段（`/<cmd_prefix>.3-execute`）：

- 完成：`- [ ]` → `- [x]`
- 新增：追加到 `3-tasks.md`

---

## 6. 命令概览

| 命令                      | 职责            | 输出                     |
| ------------------------- | --------------- | ------------------------ |
| `/<cmd_prefix>.1-spec`    | 规格撰写        | `1-spec.md`              |
| `/<cmd_prefix>.2-plan`    | 方案 + 任务拆解 | `2-plan.md` `3-tasks.md` |
| `/<cmd_prefix>.3-execute` | 执行交付        | 更新勾选状态             |
| `/<cmd_prefix>.accept`    | 验收用例        | `acceptance.md`          |
| `/<cmd_prefix>.align`     | 对齐纠偏        | `alignment.md`           |
| `/<cmd_prefix>.summary`   | 总结沉淀        | `summary-*.md`           |

---

## 7. 定制

| 我想要...  | 改什么                         |
| ---------- | ------------------------------ |
| 改输出格式 | `<specs_dir>/templates/*.md`   |
| 改核心规则 | 本文件（AGENTS.md）            |
| 加新命令   | `.cursor/commands/` 下新建文件 |
| 用风格包   | 复制 `styles/xxx/` 到对应位置  |
