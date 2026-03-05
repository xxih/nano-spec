---
name: nanospec
description: Run the full NanoSpec workflow in one skill: task init, clarify, spec, align, plan, execute, acceptance, summary, onboarding, and resumable run mode. Use when the user asks for any NanoSpec task delivery action and load only the relevant reference files for the current phase.
---

# NanoSpec

## Objective

Deliver NanoSpec tasks end to end with one unified skill and progressive disclosure.

## Core Workflow

1. Resolve task directory from explicit user input, then fallback to `.nanospec/.current`.
2. Read context in order: `alignment.md`, `brief.md` or `prd.md`, `assets/*`, workspace state.
3. Execute only the required phase for the current request.
4. Propagate requirement changes to all impacted outputs.
5. Update `outputs/3-tasks.md` immediately after finishing each actionable item.

## Progressive References

Load only the file needed for the current intent:

- Task creation/init: `references/init.md`
- Fast end-to-end routing: `references/run.md`
- Requirement clarification: `references/clarify.md`
- Spec generation: `references/spec.md`
- Alignment updates: `references/align.md`
- Planning and task breakdown: `references/plan.md`
- Task execution: `references/execute.md`
- Acceptance validation: `references/accept.md`
- Delivery summary: `references/summary.md`
- Onboarding walkthrough: `references/onboard.md`

## Global Rules

- Keep requirement changes in `alignment.md` using tags: `[偏差] [变更] [缺失] [歧义] [冲突]`.
- Use `` `⏳ 待确认` `` only for truly blocking confirmations.
- Do not leave follow-up actions only in chat; persist them into `outputs/3-tasks.md`.
- Preserve existing file language and style unless explicitly requested otherwise.
