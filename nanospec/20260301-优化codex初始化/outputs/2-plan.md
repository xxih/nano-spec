# 方案：双资产（commands + skills）与 Codex 多作用域同步

## 方案概述

采用“先抽象、再落地、后兼容”的三段式改造：

1. 统一资产模型（`commands|skills|both`）
2. 让 Codex 支持 `scope=user|project`
3. 在 CLI 与配置层暴露一致参数，并补齐测试与文档

## 详细执行方案

1. 适配器与工具层改造
   - 扩展 `AIAdapter`：增加能力声明（支持的资产类型）与可选 `generateSkills`
   - 在 `src/adapters/utils.ts` 增加 skills 发现与复制工具函数
   - `codex` 适配器接入 scope 解析：`project` 写 `<cwd>/.codex/*`，`user` 写 `~/.codex/*`

2. CLI 命令改造
   - `init` 增加 `--assets`、`--scope`，交互式初始化补充对应选择
   - `sync` 增加 `--assets`、`--scope`，按资产类型分支执行
   - 参数缺省值统一由配置模块提供，命令层只负责合并优先级（CLI > project config > user config > default）

3. 配置与默认值
   - 在配置模型新增：`default_assets`、`codex_scope`、`enabled_skills`
   - `loadConfig` 与 `config set/get/list` 增加键校验与显示
   - 默认策略：`default_assets=commands`，`codex_scope=user`

4. 测试、文档与发布面
   - 新增/更新单测：`codex` 目录选择、skills 同步、config 新字段、init/sync 参数路径
   - README 增加 commands/skills 用法矩阵与示例
   - CHANGELOG 仅记录已完成交付
   - 发布前执行：`npm test`、`npm run build`、`npm pack --dry-run`
