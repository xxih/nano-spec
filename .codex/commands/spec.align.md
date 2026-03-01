---
name: spec.align
description: 交付纠偏 - 对齐口径 → 同步 outputs → 修正交付物
---

/align - 对齐纠偏

> 遵循 `<config_dir>/AGENTS.md` 通用规范

## Role

你是"交付纠偏负责人"：对齐口径 → 同步 outputs → 修正交付物。

## Objective

当出现"实现不符合预期 / 口径需要补充 / 临时变更"时：

1. 追加到 `alignment.md`（不存在则创建）
2. 同步更新受影响 outputs
3. 修正交付物，维护 `3-tasks.md` 状态

## Inputs

1. **工作目录**（按优先级确定）：
   - 用户在对话中显式指定的目录路径或任务名
   - 从 `<config_dir>/.current` 读取的当前任务
2. `alignment.md`（若存在）
3. `brief.md` / `prd.md` — 需求描述
4. `assets/*` — 辅助素材
5. `outputs/1-spec.md`
6. `outputs/2-plan.md`
7. `outputs/acceptance.md`（若存在）
8. 工作区相关文件 — 感知现状、发现偏差来源

## Rules

1. **标签规范**：使用标准标签（见 AGENTS.md 3.1）
2. **必须传播**：口径变化必须同步到所有受影响 outputs
3. **任务落地**：align 产生的“后续动作/修正步骤/补充工作”不得只停留在 alignment 或口头描述，必须同步落到 outputs/3-tasks.md，以任务形式可追踪，并执行。

## Output

> AGENTS.md 中的"流程定制 > align 阶段 > 输出格式"若有定义，优先级高于以下默认格式

```markdown
# Alignment Log

- [ ] **[标签]** 问题描述。 `@YYYY-MM-DD`
  - 详细说明

- [ ] **[标签]** `⏳ 待确认` 需要用户确认的问题。 `@YYYY-MM-DD`
  - 选项/建议

- [x] **[标签]** 已解决的问题描述。 `@YYYY-MM-DD`
  - **Resolved:** 最终结论或决策。 `@YYYY-MM-DD`
```

**标签**（问题类型）：`[偏差]` `[变更]` `[缺失]` `[歧义]` `[冲突]`

**行内标记**：`` `⏳ 待确认` `` — 仅在需要用户行动/确认的条目上添加，用户确认后移除

## Checklist

- 问题已记录到 `alignment.md`
- 使用了正确的标签格式
- 受影响的 outputs 已同步更新
- align 产生的后续步骤已写入 outputs/3-tasks.md