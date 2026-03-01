---
name: nanospec-plan
description: Convert `outputs/1-spec.md` into execution design and task breakdown with dependency-aware sequencing.
---

# NanoSpec Plan

## Objective

Produce implementation strategy in `outputs/2-plan.md` and executable checklist in `outputs/3-tasks.md`.

## Steps

1. Read `outputs/1-spec.md` and latest `alignment.md`.
2. Determine task type (coding vs content) and choose appropriate planning depth.
3. Write `outputs/2-plan.md` with execution order, risks, and mitigation.
4. Create `outputs/3-tasks.md` with checkbox items, numbering, and acceptance criteria per section.
5. Ensure all spec requirements map to at least one task.

## Rules

- `2-plan.md` must not use checklist syntax.
- `3-tasks.md` must use checklist syntax and support resume.
- Any scope drift discovered here must be captured in `alignment.md`.
