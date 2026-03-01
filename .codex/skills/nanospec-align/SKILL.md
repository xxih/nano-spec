---
name: nanospec-align
description: Correct delivery deviations in NanoSpec tasks by recording alignment decisions and propagating updates to affected outputs. Use when implementation, scope, or acceptance criteria changes after spec/plan creation.
---

# NanoSpec Align

## Objective

Record alignment decisions and keep outputs consistent with the latest scope.

## Steps

1. Append new alignment entries to `alignment.md` using the standard log format.
2. Label each issue with `[偏差] [变更] [缺失] [歧义] [冲突]`.
3. Sync affected files in `outputs/` immediately after alignment.
4. Add or adjust actionable follow-up items in `outputs/3-tasks.md`.
5. Mark resolved alignment items with explicit `Resolved` notes and dates.

## Quality Checks

- Ensure no conflicting requirement remains between `alignment.md` and outputs.
- Ensure every new action has a corresponding task item.
- Ensure unresolved items keep `` `⏳ 待确认` `` until user confirms.
