# Init

## Objective

Create or initialize a NanoSpec task from user intent.

## Steps

1. Decide whether the request is task creation or existing task initialization.
2. Extract a concise task title from user intent.
3. Run `nanospec new <task-name>` when creating a new task is needed.
4. Write or update `brief.md` with confirmed objective and scope.
5. Confirm the task path and next command (`/spec.1-spec` or `/spec.run`).

## Rules

- Avoid placeholder names when intent is ambiguous.
- Reuse the current task when the user already targets a valid task.
