# 续跑

## 目标

识别当前任务缺失的 NanoSpec 阶段，并按顺序补齐执行；整个过程不依赖 `nanospec` CLI。

## 步骤

1. 从用户输入或 `.nanospec/.current` 定位任务目录；如果只有需求描述，就按 `YYYYMMDD-任务主题` 格式提炼任务名，并优先使用 `sh scripts/create-task-skeleton.sh "<task-topic-or-dirname>"` 创建基础骨架；脚本不可用时再手动补齐。
2. 检查现有产物：`brief.md`/`prd.md`、`alignment.md`、`outputs/1-spec.md`、`outputs/2-plan.md`、`outputs/3-tasks.md`。
3. 根据现有产出判断起始阶段：缺 spec 就做 spec，缺 plan 就做 plan，缺 tasks 或 tasks 未完成就做 execute。
4. 按顺序执行缺失阶段：spec -> plan -> execute；每个阶段完成后立即落盘，并输出简短阶段报告。
5. 遇到阻塞、偏差或待确认项时，先执行 align：写入 `alignment.md` 和 `outputs/3-tasks.md`，再决定是否暂停或继续。

## 规则

- 目录或文件缺失时，直接按约定结构手动补齐，不把 `nanospec new`、`nanospec init` 当成前置条件。
- 新建任务目录名必须使用 `YYYYMMDD-任务主题` 格式。
- 任一阶段失败都要停下并指出阻塞点。
- 执行阶段必须保持任务复选框与实际进度同步。
