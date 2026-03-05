# Run

## Objective

Resume and execute missing NanoSpec phases in order.

## Steps

1. Resolve task directory from input or `.nanospec/.current`.
2. Detect existing artifacts (`brief.md`, `outputs/1-spec.md`, `outputs/2-plan.md`, `outputs/3-tasks.md`).
3. Determine start phase from current progress.
4. Execute missing phases in order: spec -> plan -> execute.
5. Persist outputs and post a short stage report after each phase.

## Rules

- Stop on phase failure and report the blocking point.
- Keep checkboxes synchronized during execution.
