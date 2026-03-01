---
name: nanospec-accept
description: Build acceptance scenarios and verify delivered outcomes against spec, plan, tasks, and alignment records.
---

# NanoSpec Accept

## Objective

Create or update `outputs/acceptance.md` with executable acceptance coverage.

## Steps

1. Read `outputs/1-spec.md`, `outputs/2-plan.md`, `outputs/3-tasks.md`, and `alignment.md`.
2. Derive acceptance scenarios for functional path, boundaries, and regressions.
3. Map each scenario to expected evidence (test, output, behavior, artifact).
4. Mark pass/fail status and unresolved gaps.
5. Save to `outputs/acceptance.md`.

## Quality Checks

- Each core requirement has at least one acceptance scenario.
- Failed or blocked scenarios include concrete follow-up actions.
- Acceptance conclusions are traceable to existing outputs.
