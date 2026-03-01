# 规格说明：完善 Skills 覆盖 NanoSpec 全流程能力

## 背景与目标

当前任务目录为 `nanospec/20260301-完善skills`。`brief.md` 指出：现有 skills 不能覆盖 NanoSpec 的全部能力，导致在不依赖 commands 机制时，工作流可用性不足。

结合项目现状：
- `src/static/commands/` 已包含完整命令能力（`spec.init`、`spec.run`、`spec.clarify`、`spec.1-spec`、`spec.2-plan`、`spec.3-execute`、`spec.align`、`spec.accept`、`spec.summary`、`spec.onboard`）。
- `src/static/skills/` 当前仅有 `nanospec-workflow`、`nanospec-align` 两个技能，覆盖面明显不足。
- Codex 的 skills 同步能力已具备（`listAvailableSkills` + `copySkillToDir` + `init/sync --assets skills`），当前瓶颈在于内置 skill 资产内容不完整。

目标：
- 补齐内置 skills，使其对 NanoSpec 关键流程能力形成完整覆盖。
- 在“无 commands 依赖”的使用方式下，仍可通过 skill 触发完成 init/run/spec/plan/execute/clarify/accept/summary/onboard/align 等核心动作。
- 同步更新文档与测试，保证能力可发现、可验证、可维护。

## 核心组成

```text
Skills 全覆盖改造
├── A. 技能资产补齐（新增技能目录与 SKILL.md）
├── B. 能力映射与可验证性（测试补强）
└── C. 使用说明同步（README + CHANGELOG）
```

### A. 技能资产补齐（新增）

交付物表现：
- 在 `src/static/skills/` 新增面向缺失能力的技能目录，至少覆盖：
  - init / run / clarify / spec / plan / execute / accept / summary / onboard
- 保留并兼容既有 `nanospec-workflow`、`nanospec-align`。
- 每个技能目录包含结构合法的 `SKILL.md`（frontmatter + objective/steps/rules）。

验收标准：
- `listAvailableSkills()` 返回结果包含上述新增技能。
- 通过 codex skills 同步后，目标目录可看到新增技能文件。
- 技能文本包含明确触发场景与输出产物，不是空壳描述。

### B. 能力映射与可验证性（新增）

交付物表现：
- 增加测试，验证 skills 列表中存在全流程关键技能。
- 明确“commands 能力 → skills 能力”映射的最小覆盖集合，防止后续回退为部分覆盖。

验收标准：
- 测试可稳定识别关键技能是否缺失。
- 关键能力缺失时测试会失败。

### C. 使用说明同步（修改）

交付物表现：
- README 增补“内置 skills 能力覆盖”说明与典型用法。
- CHANGELOG 记录本次已完成交付（仅已落地内容）。

验收标准：
- 用户能从 README 直接理解 skills 模式可覆盖的工作流能力。
- 变更记录与实际代码一致。

## 成功标志

- `src/static/skills/` 形成覆盖核心命令能力的技能集合，不再只有 workflow/align 两项。
- 与 skills 相关的单测通过，且能对关键覆盖缺失给出回归保护。
- README、CHANGELOG 与实现保持一致，说明“可不依赖 commands 机制运转”的边界与用法。

## 约束与注意

> 必须遵守的限制条件

- 风格/规范：保持现有 skill 文档风格（frontmatter + 简洁步骤），优先英文结构化字段与中文业务语义并存。
- 依赖项：不引入新运行时依赖，仅使用现有目录扫描与同步机制。
- 兼容性：不得破坏已有 `nanospec-workflow`、`nanospec-align` 与现有 commands 能力。
- 测试约束：新增能力必须补充单测。
- 文档约束：新增用户可见能力需同步更新 `README.md`，并检查 `CHANGELOG.md`。
