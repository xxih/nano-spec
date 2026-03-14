---
name: nanospec
description: "用一个统一 skill 执行 NanoSpec 全流程：init、clarify、spec、align、plan、execute、accept、summary、onboard，以及可恢复的 run 模式。用户提出任一 NanoSpec 交付请求时使用，并只按当前阶段加载所需的 references。"
---

# NanoSpec

## 目标

用一个统一 skill 端到端推进 NanoSpec 任务，并通过渐进披露只读取当前阶段所需参考文件。

## 任务目录结构

```text
project-root/
├── .nanospec/
│   └── .current                  # 当前任务名，可选
└── nanospec/
    └── <YYYYMMDD-task-name>/
        ├── brief.md              # 简述需求，和 prd.md 二选一或并存
        ├── prd.md                # 更正式的需求文档，可选
        ├── alignment.md          # 对齐记录，可按需创建
        ├── assets/
        │   └── ...               # 资料、截图、草图、补充文档
        └── outputs/
            ├── 1-spec.md
            ├── 2-plan.md
            ├── 3-tasks.md
            ├── acceptance.md     # 可选，验收阶段生成
            └── summary.md        # 可选，总结阶段生成
```

- 仓库里没有 `nanospec` CLI 时，也按上面的结构直接创建和维护文件。
- 新建任务目录名必须使用 `YYYYMMDD-任务主题` 格式，例如 `20260315-skills跨工具安装指南`。
- `.nanospec/.current` 只是任务指针，不是 skill 生效的前置条件。

## 核心流程

1. 优先从用户显式输入解析任务目录，其次读取 `.nanospec/.current`；仍无法定位时，按 `YYYYMMDD-任务主题` 格式在 `nanospec/` 下手动创建目录。
2. 按顺序读取 `alignment.md`、`brief.md`/`prd.md`、`assets/*` 与工作区现状。
3. 只执行本次请求所需阶段；如果用户要求 `/run`，就按缺失阶段自动续跑。
4. 只要出现需求变化、实现偏差或临时决策，先执行 align：更新 `alignment.md`，同步所有受影响产物，再继续其他阶段。
5. align 产生的后续动作必须回写到 `outputs/3-tasks.md`，不能只停留在对话或 `alignment.md`。
6. 每完成一个可执行事项，立即更新 `outputs/3-tasks.md`。

## 渐进加载

只加载当前意图需要的参考文件：

- 创建或初始化任务：`references/init.md`
- 快速续跑全流程：`references/run.md`
- 需求澄清：`references/clarify.md`
- 规格产出：`references/spec.md`
- 对齐更新：`references/align.md`
- 规划与任务拆解：`references/plan.md`
- 任务执行：`references/execute.md`
- 验收校验：`references/accept.md`
- 交付总结：`references/summary.md`
- 新人上手：`references/onboard.md`

## 全局规则

- align 不是可选补记；出现偏差或变更时，继续 spec / plan / execute 之前必须先完成 align 回写。
- 需求变化统一记录到 `alignment.md`，并使用标签：`[偏差] [变更] [缺失] [歧义] [冲突]`。
- 只有真正阻塞推进的确认项，才使用 `` `⏳ 待确认` ``。
- 不要把后续行动只留在对话里，必须回写到 `outputs/3-tasks.md`。
- 除非用户明确要求调用 CLI，否则不要把 `nanospec init`、`nanospec new`、`nanospec status`、`nanospec switch` 当成前置步骤。
- 保持现有文件语言和风格，除非用户明确要求调整。
