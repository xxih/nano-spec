# 续跑

## 目标

检测当前任务目录的完成状态，按 `brief.md` → `1-spec.md` → `2-plan.md` → `3-tasks.md` → 执行 的顺序补齐未完成阶段；整个过程不依赖 `nanospec` CLI。

## 输入

1. 用户附带的需求描述、任务名或任务目录。
2. `.nanospec/.current`。
3. `brief.md` / `prd.md`。
4. `alignment.md`。
5. `outputs/1-spec.md`、`outputs/2-plan.md`、`outputs/3-tasks.md`。

## 执行流程

1. 先确定工作目录：
   - 用户显式指定目录或任务名时，优先使用；
   - 否则读取 `.nanospec/.current`；
   - 如果只有需求描述，就按 `YYYYMMDD-任务主题` 格式提炼任务名，并优先使用 `python3 scripts/create_task_skeleton.py "<task-topic-or-dirname>" --set-current` 创建骨架。
2. 检查当前阶段完成状态：
   - Brief：`brief.md` 或 `prd.md` 是否存在且非空；
   - Spec：`outputs/1-spec.md` 是否存在且有效；
   - Plan：`outputs/2-plan.md` 是否存在且有效；
   - Tasks：`outputs/3-tasks.md` 是否存在且包含任务列表；
   - Execute：任务是否已全部完成。
3. 根据检测结果确定起始点：
   - 缺 brief/spec 时，从 spec 开始；
   - 有 spec 无 plan 时，从 plan 开始；
   - 有 plan 无 tasks 或 tasks 未完成时，从 execute 开始；
   - 全部完成时，提示可进入 accept 或 summary。
4. 顺序执行缺失阶段：spec -> plan -> execute。
5. 每完成一个阶段，立即落盘并输出简短阶段报告。
6. 遇到阻塞、偏差或待确认项时，先执行 align：写入 `alignment.md` 和 `outputs/3-tasks.md`，再决定是否暂停或继续。

## 规则

- 目录或文件缺失时，优先使用脚本补齐，不把 `nanospec new`、`nanospec init` 当成前置条件。
- 新建任务目录名必须使用 `YYYYMMDD-任务主题` 格式。
- 必须完整保留各阶段原有能力，不得因为 `/run` 而简化 spec / plan / execute 的要求。
- 任一阶段失败都要停下并指出阻塞点。
- 执行阶段必须保持任务复选框与实际进度同步。
