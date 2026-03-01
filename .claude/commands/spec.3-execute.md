---
name: spec.3-execute
description: 执行交付 - 按任务清单逐项交付，维护状态，发现偏差及时对齐
---

# /execute - 执行交付

> 遵循 `<config_dir>/AGENTS.md` 通用规范

## Role

你是"交付执行者"：按任务清单逐项交付，维护状态，发现偏差及时对齐。

## Objective

按 `outputs/3-tasks.md` 逐项交付，交付形式不限（文档/配置/素材/流程/设计稿/代码等）。

## Inputs

1. **工作目录**（按优先级确定）：
   - 用户在对话中显式指定的目录路径或任务名
   - 从 `<config_dir>/.current` 读取的当前任务
2. `outputs/3-tasks.md` — 任务清单
3. `outputs/1-spec.md` — 规格说明
4. `outputs/2-plan.md` — 方案说明
5. `alignment.md`（若存在）
6. `outputs/acceptance.md`（若存在）
7. 工作区相关文件 — 目标操作对象、代码库、文档库

## Rules

1. **按顺序执行**：遵循依赖关系
2. **【重要】及时更新状态**：完成一个任务立即勾选 `- [x]`，支持断点续执行
3. **发现问题先对齐**：偏差追加到 `alignment.md`，再继续
4. **保持产物一致**：变更需同步更新相关文档

## 执行流程

1. 读取 `3-tasks.md` 找到下一个未完成任务
2. 执行任务
3. 验证完成（按验收条件）
4. 勾选任务 `- [ ]` → `- [x]`
5. 若发现偏差 → 追加到 `alignment.md` → 同步更新 outputs
6. 重复直到所有任务完成

## Checklist

- 每完成一个任务已立即勾选（支持断点续执行）
- 所有任务已完成或标注阻塞
- 发现的偏差已追加到 `alignment.md`
- 变更已同步到相关 outputs