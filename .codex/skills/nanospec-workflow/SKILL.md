---
name: nanospec-workflow
description: Drive NanoSpec tasks from brief to delivery with consistent command order and artifact updates. Use when working in a nanospec task directory and producing or updating outputs/1-spec.md, outputs/2-plan.md, outputs/3-tasks.md, alignment.md, acceptance.md, or summary.md.
---

# NanoSpec Workflow

## Objective

Execute NanoSpec tasks with stable output quality and traceable progress.

## Steps

1. Resolve task directory from user input first, then fallback to `.nanospec/.current`.
2. Read inputs in priority order: `alignment.md`, `brief.md` or `prd.md`, `assets/*`, workspace state.
3. Update target output file for the current phase.
4. Propagate requirement changes to all impacted outputs.
5. Update `outputs/3-tasks.md` status immediately after finishing each actionable item.

## Rules

- Keep requirement changes in `alignment.md` with standard tags: `[偏差] [变更] [缺失] [歧义] [冲突]`.
- Use `` `⏳ 待确认` `` only when user confirmation is required.
- Do not leave follow-up actions only in discussion text; convert them into tasks in `outputs/3-tasks.md`.
- Preserve existing file language and style unless explicitly asked to rewrite.
