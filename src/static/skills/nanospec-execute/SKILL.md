---
name: nanospec-execute
description: Execute `outputs/3-tasks.md` step by step, verify outcomes, and update task status in real time.
---

# NanoSpec Execute

## Objective

Deliver the work items in `outputs/3-tasks.md` with traceable progress and consistency.

## Steps

1. Read `outputs/3-tasks.md`, `outputs/1-spec.md`, `outputs/2-plan.md`, and `alignment.md`.
2. Find the next unchecked item respecting task dependencies.
3. Implement and validate the change (code/docs/assets as required).
4. Immediately mark completed item `- [x]`.
5. Repeat until all items are done or explicitly blocked.

## Rules

- Update status right after each completion, not at the end.
- If blocked or out-of-scope, append the issue to `alignment.md` first.
- Keep related outputs/docs synchronized with delivered behavior.
