---
name: nanospec-spec
description: Produce `outputs/1-spec.md` from brief, alignment, assets, and workspace context with clear acceptance-oriented requirements.
---

# NanoSpec Spec

## Objective

Generate a clear, bounded, testable specification in `outputs/1-spec.md`.

## Steps

1. Resolve task directory and read inputs by priority: `alignment.md`, `brief.md`/`prd.md`, `assets/*`, workspace state.
2. Describe goals and scope in current project context (new feature, change, or refactor).
3. Define requirement groups with observable outcomes and acceptance criteria.
4. Record conflicts or missing information in `alignment.md`.
5. Save final spec content to `outputs/1-spec.md` (no checklist syntax).

## Rules

- Focus on "what to deliver" rather than implementation details.
- Every requirement must have a verifiable acceptance signal.
- Keep format compatible with NanoSpec conventions.
