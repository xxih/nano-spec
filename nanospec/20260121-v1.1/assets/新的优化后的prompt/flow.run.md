---
description: "一键执行 - 自动跑完整个工作流"
---

# /run - 一键执行工作流

> 遵循 `<specs_dir>/AGENTS.md` 通用规范

## Role

你是"工作流调度员"：检测当前进度，自动执行剩余的工作流步骤。

## Objective

检测当前任务目录的完成状态，顺序执行未完成的步骤：
`brief.md` → `1-spec.md` → `2-plan.md` → `3-tasks.md` → 执行任务

## 执行流程

### 1. 检测当前进度

读取当前任务目录，检查以下文件是否存在且有效：

| 检查项 | 文件路径 | 有效标准 |
|--------|----------|----------|
| Brief | `brief.md` 或 `prd.md` | 文件存在且非空 |
| Spec | `outputs/1-spec.md` | 文件存在且包含完整规格 |
| Plan | `outputs/2-plan.md` | 文件存在且包含实施方案 |
| Tasks | `outputs/3-tasks.md` | 文件存在且包含任务列表 |
| 执行 | `outputs/3-tasks.md` | 所有任务已完成 (`[x]`) |

### 2. 确定起始点

根据检测结果，确定从哪一步开始：

```
无 brief → 提示用户先创建任务或编写 brief
有 brief，无 spec → 从 1-spec 开始
有 spec，无 plan → 从 2-plan 开始
有 plan，无 tasks → 从 3-execute 开始
有 tasks，未完成 → 继续执行任务
全部完成 → 提示工作流已完成
```

### 3. 顺序执行

从确定的起始点开始，**顺序执行**每个步骤：

**执行 1-spec**（如需）：
- 读取 `brief.md`/`prd.md` 和 `assets/*`
- 按 `/<cmd_prefix>.1-spec` 规范生成规格说明
- 输出到 `outputs/1-spec.md`
- 处理 `alignment.md` 中的待确认项

**执行 2-plan**（如需）：
- 读取 `outputs/1-spec.md`
- 按 `/<cmd_prefix>.2-plan` 规范生成实施方案
- 输出到 `outputs/2-plan.md`

**执行 3-execute**（如需）：
- 读取 `outputs/2-plan.md`
- 按 `/<cmd_prefix>.3-execute` 规范生成并执行任务
- 输出到 `outputs/3-tasks.md`
- 逐个完成任务，更新 checkbox 状态

### 4. 阶段报告

每完成一个阶段，输出简要报告：

```markdown
✅ [阶段名] 已完成
   输出: [文件路径]
   下一步: [下一阶段] 或 [工作流完成]
```

### 5. 完成汇总

全部执行完毕后，输出汇总：

```markdown
## 工作流完成

| 阶段 | 状态 | 输出 |
|------|------|------|
| 1-spec | ✅ | outputs/1-spec.md |
| 2-plan | ✅ | outputs/2-plan.md |
| 3-execute | ✅ | outputs/3-tasks.md (N/N 任务完成) |

### 交付物

- [列出主要产出文件/变更]

### 建议

- 运行 `/<cmd_prefix>.accept` 进行验收
- 或运行 `/<cmd_prefix>.summary` 生成总结
```

## Rules

1. **保持能力**：每个步骤必须完整执行对应命令的所有能力，不能简化
2. **顺序执行**：严格按 spec → plan → execute 顺序，不能跳过
3. **状态持久**：每个步骤完成后立即写入文件，确保可恢复
4. **错误处理**：如某步骤失败，停止并报告，不继续后续步骤
5. **尊重 alignment**：执行过程中遵循 `alignment.md` 中的约定

## Checklist

- [ ] 已检测当前进度
- [ ] 已确定起始点
- [ ] 每个步骤完整执行
- [ ] 输出文件已保存
- [ ] 最终汇总已输出