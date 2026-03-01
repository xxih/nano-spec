## 0. 对齐同步（align 执行项）

- [x] 0.1 新建 `alignment.md` 并记录范围变更（commands + skills、codex user/project）
- [x] 0.2 同步更新 `outputs/1-spec.md` 到双资产口径
- [x] 0.3 同步更新 `outputs/2-plan.md` 到双资产口径
- [x] 0.4 重排 `outputs/3-tasks.md`，将后续动作落地为可追踪任务

验收条件：alignment 与 outputs 口径一致，且所有后续动作已任务化。

## 1. 资产模型改造（commands + skills）

- [x] 1.1 扩展 `AIAdapter` 接口，声明支持的资产类型（`commands|skills`）
- [x] 1.2 在 `src/adapters/utils.ts` 新增 skills 发现/复制工具函数
- [x] 1.3 为 `src/static/skills/` 建立最小内置样例并接入构建产物
- [x] 1.4 补充对应单测（utils 与适配器层）

验收条件：命令层可按资产类型调用底层生成逻辑，skills 资源可被发现与复制。

## 2. Codex 作用域支持（user/project）

- [x] 2.1 为 codex 增加 scope 目录解析（`~/.codex/*` 与 `<cwd>/.codex/*`）
- [x] 2.2 commands 同步支持 `~/.codex/prompts/`
- [x] 2.3 skills 同步支持 `~/.codex/skills/`
- [x] 2.4 增加 codex 作用域单测（user/project 两路径）

验收条件：Codex 在 `scope=user|project` 下都能正确落盘。

## 3. CLI 与配置改造

- [x] 3.1 `nanospec init` 新增 `--assets`、`--scope` 参数与交互选项
- [x] 3.2 `nanospec sync` 新增 `--assets`、`--scope` 参数
- [x] 3.3 `nanospec config` 新增 `default_assets`、`codex_scope`、`enabled_skills`
- [x] 3.4 更新 `src/index.ts` 与命令注册测试覆盖新增参数语义

验收条件：CLI > 项目配置 > 全局配置 > 默认值 的优先级一致可验证。

## 4. 文档、变更记录与回归

- [x] 4.1 更新 `README.md`：commands/skills 使用方式与示例
- [x] 4.2 更新 `CHANGELOG.md`：仅记录本次已交付内容
- [x] 4.3 运行 `npm test`
- [x] 4.4 运行 `npm run build`
- [x] 4.5 运行 `npm pack --dry-run` 并检查 tarball 不包含未完成功能相关文件（重点 `ralph`）

验收条件：测试与构建通过，发布包内容符合发布约束。
