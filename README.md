# NanoSpec CLI

轻量、可扩展的 Spec 驱动工作流工具。用统一流程把需求落成可执行任务：
`brief -> spec -> plan -> execute`。

## 3 分钟上手

```bash
# 1) 安装
npm install -g nano-spec

# 2) 初始化（默认交互式选择 AI 工具）
nanospec init

# 3) 创建任务（可直接回车使用默认名“待命名”）
nanospec new
```

在 AI 工具中按顺序执行：

- `/spec.1-spec`：生成规格说明
- `/spec.2-plan`：生成实施方案与任务拆解
- `/spec.3-execute`：执行任务并更新状态

`/init` 使用建议（已初始化项目）：

- 直接给出任务目标：`/init 创建用户认证功能`
- 避免只输入 `/init` 或“创建任务”这类泛化描述，否则应先补充任务名与一句话目标

## 核心命令

| 命令 | 简写 | 说明 |
|---|---|---|
| `nanospec init [--assets <commands\|skills\|both>] [--scope <project\|user>]` | `nanospec i` | 初始化项目结构并同步资产（commands/skills） |
| `nanospec new [name]` | `nanospec n [name]` | 创建任务目录并设为当前任务；不带 `name` 时进入交互输入（默认“待命名”） |
| `nanospec switch [name]` | `nanospec s [name]` | 切换当前任务 |
| `nanospec status` | `nanospec st` | 查看当前任务状态 |
| `nanospec sync [--adapter <name>] [--assets <commands\|skills\|both>] [--scope <project\|user>]` | `nanospec sy [--adapter <name>]` | 同步资产到 AI 工具目录 |
| `nanospec preset list/install/uninstall` | `nanospec p ls/add/rm` | 预设包管理 |
| `nanospec config` | `nanospec c` | 查看当前配置 |
| `nanospec config get/set/unset/list` | `nanospec c g/s/u/ls` | 读写配置（支持 `--global`） |

## 工作流概览

1. 需求：在 `brief.md` 或 `prd.md` 写清目标
2. 规格：`/spec.1-spec`
3. 规划：`/spec.2-plan`
4. 执行：`/spec.3-execute`
5. 对齐（可选）：`/spec.align`
6. 验收/总结（可选）：`/spec.accept`、`/spec.summary`

## 预设包

内置预设：

- `frontend`：前端开发
- `backend`：后端开发
- `refactor`：重构任务
- `docs`：文档写作

示例：

```bash
nanospec preset list
nanospec preset install frontend
```

## 配置

默认配置文件在 `.nanospec/config.json`，也可使用 CLI 管理：

```bash
nanospec config list
nanospec config get default_adapter
nanospec config set default_adapter codex
```

常用配置项：`specs_root`、`cmd_prefix`、`default_adapter`、`template_format`、`auto_sync`。

新增配置项：

- `default_assets`：默认同步资产类型（`commands` / `skills` / `both`）
- `codex_scope`：codex 输出作用域（`project` / `user`）
- `enabled_skills`：仅同步指定 skills（JSON 数组；空数组表示全部内置 skills）

## 支持的 AI 工具

- `cursor`
- `codex`
  - `commands`：`./.codex/prompts/`（`--scope project`）或 `~/.codex/prompts/`（`--scope user`）
  - `skills`：`./.codex/skills/`（`--scope project`）或 `~/.codex/skills/`（`--scope user`）
- `qwen`
- `iflow`
- `cline`
- `claude-code`
- `copilot`
- `windsurf`
- `kilo-code`

## 项目结构

```text
project-root/
├── .nanospec/
│   ├── AGENTS.md
│   ├── config.json
│   └── .current
├── nanospec/
│   └── <task-name>/
│       ├── brief.md
│       ├── alignment.md
│       └── outputs/
│           ├── 1-spec.md
│           ├── 2-plan.md
│           └── 3-tasks.md
├── .<ai-tool>/commands/
└── .codex/
    ├── prompts/
    └── skills/
```

## 常见问题

### `nanospec init` 后没有资产文件？

运行：

```bash
nanospec sync
```

如果使用 `codex` 且指定了 `--scope user`，请检查 `~/.codex/prompts/` 与 `~/.codex/skills/`。

### 如何继续上次任务？

```bash
nanospec status
nanospec switch
```

## 维护者信息

- 变更记录：`CHANGELOG.md`
- 内部开发指南：`guides/README.md`

## License

MIT
