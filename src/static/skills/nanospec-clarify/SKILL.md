---
name: nanospec-clarify
description: Clarify ambiguous requirements before spec or execution by turning open questions into confirmed constraints.
---

# NanoSpec Clarify

## Objective

Convert vague or conflicting inputs into explicit, actionable constraints.

## Steps

1. Read `brief.md` / `prd.md` and identify ambiguity, conflicts, or missing constraints.
2. Group questions by scope, behavior, edge case, and acceptance criteria.
3. Ask concise clarification questions and record confirmed answers.
4. Append unresolved items to `alignment.md` with `⏳ 待确认`.
5. Propagate confirmed decisions to spec/plan/tasks outputs.

## Rules

- Prefer minimal, high-impact questions instead of broad interviews.
- Mark only truly blocking items as `⏳ 待确认`.
- Never leave confirmed decisions only in chat; persist them to files.
