---
name: nanospec-run
description: Run the NanoSpec pipeline end-to-end with progress detection and resumable execution from spec to delivery.
---

# NanoSpec Run

## Objective

Detect task progress and execute remaining phases in order: spec -> plan -> execute.

## Steps

1. Resolve task directory from explicit input or `.nanospec/.current`.
2. Check state for `brief.md`, `outputs/1-spec.md`, `outputs/2-plan.md`, `outputs/3-tasks.md`.
3. Determine start phase based on existing valid outputs.
4. Execute missing phases sequentially without skipping dependencies.
5. After each phase, persist outputs immediately and publish a short stage report.

## Rules

- Stop on failure and report the failed phase; do not continue blindly.
- Respect `alignment.md` decisions during all phases.
- Keep task checkboxes updated during execution for resumability.
