# 规格说明：Codex `prompts` + NanoSpec `commands/skills` 双资产支持

## 背景与目标

当前实现只覆盖 `commands`（slash commands）这一类资产，且 Codex 目录语义仍偏项目级。新口径要求：

- Codex 要支持把 slash commands 生成到 `~/.codex/prompts/`（用户级）
- NanoSpec 除了 slash commands，还要支持 `skills`
- CLI 需要统一承载 `commands` 与 `skills` 两种同步路径

本次目标是将产物模型升级为“双资产”，并让 Codex 同时支持用户级/项目级 `prompts` 目录。

## 核心组成

- 资产模型升级
  - 资产类型：`commands`、`skills`
  - 统一语义：`commands | skills | both`
  - 影响范围：适配器接口、`init`、`sync`、配置项、测试和文档

- Codex 目录策略
  - `project`：`<cwd>/.codex/prompts/`
  - `user`：`~/.codex/prompts/`
  - 默认策略：Codex 走 `user`，并允许通过 CLI/配置切换

- Skills 资源与同步
  - 内置来源：`src/static/skills/<skill-id>/...`
  - 目标目录（Codex）：`~/.codex/skills/<skill-id>/...`（`project` 模式则写入 `<cwd>/.codex/skills/...`）
  - 同步时支持增量覆盖（同名覆盖，不做历史清理）

- CLI 交互语义
  - `init` 新增 `--assets <commands|skills|both>`、`--scope <user|project>`
  - `sync` 新增相同语义，支持仅同步某一资产
  - `config` 新增持久化键：`default_assets`、`codex_scope`、`enabled_skills`

## 成功标志

- `nanospec init --ai codex --assets commands --scope user` 可生成到 `~/.codex/prompts/`
- `nanospec sync --adapter codex --assets skills --scope user` 可生成 skills 目录
- `init/sync/config` 对 `commands|skills|both` 行为一致，且不破坏其他适配器现有 `commands` 行为
- 单测覆盖新增行为：目录选择、资产过滤、配置读取与回退
- README 与 CHANGELOG 与实现一致

## 约束与注意

- 保持现有命令模板格式与命名不变（如 `spec.1-spec.md`）
- 对非 Codex 适配器，skills 可先返回“暂不支持”并安全跳过
- 发布记录仅写已完成交付项，未落地能力不写入版本日志
