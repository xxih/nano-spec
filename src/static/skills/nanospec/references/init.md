# 初始化

## 目标

根据用户输入创建任务、填写 `brief.md`，并建立后续阶段可继续复用的任务骨架。

## 输入

1. 用户的自然语言需求描述。
2. 用户显式指定的任务目录或任务名（若有）。
3. 当前仓库的 `.nanospec/.current`（仅在用户未显式指定时作为候选）。

## 执行流程

1. 从用户输入中提取任务名称和任务意图。
2. 对任务名称做有效性检查：
   - 名称必须直接对应功能、页面、模块、问题或主题；
   - 新建任务目录必须使用 `YYYYMMDD-任务主题` 格式；
   - 禁止使用“新任务”“临时任务”“todo”这类泛化命名；
   - 如果无法明确提取任务名，先提出一个最小阻塞问题，不直接创建。
3. 仍然不依赖 `nanospec` CLI：优先使用 `python3 scripts/create_task_skeleton.py "<task-topic-or-dirname>" --set-current` 创建骨架；若脚本不可用，再手动创建 `nanospec/<YYYYMMDD-task-name>/`、`assets/`、`outputs/`，并按需更新 `.nanospec/.current`。
4. 根据用户意图填写或更新 `brief.md`：
   - 背景：用户的原始描述；
   - 目标：从意图中提炼的目标；
   - 约束：若有提及则写明，否则留空待补。
5. 明确任务路径，并提示下一步进入 spec，或直接继续 `/run`。

## 输出

- `nanospec/<YYYYMMDD-task-name>/brief.md`
- `nanospec/<YYYYMMDD-task-name>/alignment.md`
- `nanospec/<YYYYMMDD-task-name>/assets/`
- `nanospec/<YYYYMMDD-task-name>/outputs/1-spec.md`
- `nanospec/<YYYYMMDD-task-name>/outputs/2-plan.md`
- `nanospec/<YYYYMMDD-task-name>/outputs/3-tasks.md`

## 规则

- 任务名必须以当前日期前缀 `YYYYMMDD-` 开头，并直接对应功能、问题或主题，避免占位命名。
- 用户已经指定有效任务目录时，优先复用，不重复创建。
- 使用脚本时，若用户只提供主题名，允许脚本自动补全当天日期前缀。
- 任务信息不足时，先补问，不要直接生成模糊任务。
