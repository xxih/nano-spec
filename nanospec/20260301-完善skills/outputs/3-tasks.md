# 任务清单：完善 Skills 覆盖 NanoSpec 全流程能力

## 1. Skills 资产补齐

- [x] 1.1 新增 `nanospec-init`、`nanospec-run`、`nanospec-clarify` 三个技能
- [x] 1.2 新增 `nanospec-spec`、`nanospec-plan`、`nanospec-execute` 三个技能
- [x] 1.3 新增 `nanospec-accept`、`nanospec-summary`、`nanospec-onboard` 三个技能
- 验收条件：`src/static/skills/` 下可见新增技能目录，且每个目录包含合法 `SKILL.md`

## 2. 测试回归补强

- [x] 2.1 更新 `src/adapters/utils.test.ts`，增加关键 skills 覆盖断言
- [x] 2.2 运行 `npm test -- src/adapters/utils.test.ts`
- 验收条件：skills 关键覆盖集合通过测试验证

## 3. 文档与变更记录同步

- [x] 3.1 更新 `README.md`，补充内置 skills 覆盖说明
- [x] 3.2 更新 `CHANGELOG.md` Unreleased
- 验收条件：README 与 CHANGELOG 准确反映本次已交付内容

## 4. 全量验证与收尾

- [x] 4.1 运行 `npm test`
- [x] 4.2 回填并确认任务全部完成
- 验收条件：全量测试通过，`outputs/3-tasks.md` 全部勾选
