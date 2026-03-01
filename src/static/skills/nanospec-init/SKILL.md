---
name: nanospec-init
description: Create or initialize a NanoSpec task from user intent, including task-name extraction, directory creation, and brief bootstrapping.
---

# NanoSpec Init

## Objective

Turn a user request into a ready-to-work NanoSpec task directory.

## Steps

1. Resolve whether the request is a new task creation or initialization path.
2. Extract a concise task title from the user's intent; ask clarification only when title/goal is missing.
3. Run `nanospec new <task-name>` when creating a new task is required.
4. Write or update `brief.md` with the confirmed requirement summary.
5. Confirm task path and next command (`/spec.1-spec` or `/run`).

## Rules

- Do not create placeholder task names when the intent is ambiguous.
- Keep `.nanospec/.current` behavior consistent with CLI semantics.
- If user already provided a valid target task, reuse it instead of creating duplicates.
