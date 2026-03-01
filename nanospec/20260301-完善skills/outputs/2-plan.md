# 方案：NanoSpec Skills 全覆盖落地方案

## 方案概述

本任务属于代码与文档联合改造，按“先补资产、再加回归、后做文档与验证”的顺序执行，确保每一步可独立验收并可回滚。

## 详细执行方案

1. 补齐内置 skills 资产
- 在 `src/static/skills/` 新增缺失能力对应技能目录：`nanospec-init`、`nanospec-run`、`nanospec-spec`、`nanospec-plan`、`nanospec-execute`、`nanospec-clarify`、`nanospec-accept`、`nanospec-summary`、`nanospec-onboard`。
- 每个目录新增 `SKILL.md`，统一包含 frontmatter、Objective、Steps、Rules/Checks。
- 保持已有 `nanospec-workflow`、`nanospec-align` 不变，避免破坏兼容性。

2. 增强 skills 覆盖回归测试
- 更新 `src/adapters/utils.test.ts`：新增“关键内置 skills 必须存在”的断言集合。
- 在测试中显式校验新增技能名，确保未来删除或漏发会立即失败。

3. 同步用户文档与变更记录
- 更新 `README.md`：新增“内置 skills 覆盖矩阵”或等效说明，明确不依赖 commands 时的能力入口。
- 更新 `CHANGELOG.md` Unreleased：记录本次新增 skills 与测试、文档更新。

4. 验证与收尾
- 运行与改动路径直接相关测试：`npm test -- src/adapters/utils.test.ts`。
- 再运行一次全量测试：`npm test`，确认无回归。
- 将执行结果回填到 `outputs/3-tasks.md`（逐项勾选）。

## 风险与应对

- 风险：新增 skill 命名与已有能力语义重复，导致触发不稳定。
- 应对：在 skill 描述中写清“触发场景 + 输出文件”，减少歧义。

- 风险：仅补 skill 文档但未形成回归保护，后续容易回退。
- 应对：通过测试固定关键技能集合。

- 风险：文档未同步导致用户仍按旧认知使用。
- 应对：README 增加独立章节，CHANGELOG 记录已交付能力。
