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
| `nanospec -V, --version` | - | 显示当前安装的 CLI 版本 |

## 工作流概览

1. 需求：在 `brief.md` 或 `prd.md` 写清目标
2. 规格：`/spec.1-spec`
3. 规划：`/spec.2-plan`
4. 执行：`/spec.3-execute`
5. 对齐（可选）：`/spec.align`
6. 验收/总结（可选）：`/spec.accept`、`/spec.summary`

## 内置 Skills 覆盖

当你使用 `codex` 或 `claude-code` 且同步 `skills` 资产时，即使不依赖 slash commands，也可以通过技能触发完整流程能力。

| 能力 | Skill |
|---|---|
| 任务创建/初始化 | `nanospec-init` |
| 一键调度（断点续跑） | `nanospec-run` |
| 规格撰写 | `nanospec-spec`、`nanospec-workflow` |
| 方案设计 | `nanospec-plan`、`nanospec-workflow` |
| 执行交付 | `nanospec-execute`、`nanospec-workflow` |
| 对齐纠偏 | `nanospec-align` |
| 需求澄清 | `nanospec-clarify` |
| 验收 | `nanospec-accept` |
| 总结沉淀 | `nanospec-summary` |
| 新手引导 | `nanospec-onboard` |

仅同步 skills 示例：

```bash
nanospec sync --adapter codex --assets skills
```

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
- `codex_scope`：作用域配置（`project` / `user`），用于支持 scoped 目录的资产（如 `codex` skills、`claude-code`、`gemini`）
- `enabled_skills`：仅同步指定 skills（JSON 数组；空数组表示全部内置 skills）

## 支持的 AI 工具

- `cursor`
- `codex`
  - `commands`：`~/.codex/prompts/`（固定用户级；即使传 `--scope project` 也会回退到 user）
  - `skills`：`./.codex/skills/`（`--scope project`）或 `~/.codex/skills/`（`--scope user`）
- `claude-code`
  - `commands`：`./.claude/commands/`（`--scope project`）或 `~/.claude/commands/`（`--scope user`）
  - `skills`：`./.claude/skills/`（`--scope project`）或 `~/.claude/skills/`（`--scope user`）
- `gemini`
  - `commands`：`./.gemini/commands/`（`--scope project`）或 `~/.gemini/commands/`（`--scope user`）
- `qwen`
- `iflow`
- `cline`
- `copilot`
  - `commands`：`./.github/prompts/*.prompt.md`
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
├── .github/
│   └── prompts/
└── .codex/
    └── skills/

~/.codex/
└── prompts/
```

## 常见问题

### `nanospec init` 后没有资产文件？

运行：

```bash
nanospec sync
```

如果使用了 `--scope user`，请检查对应用户目录（如 `~/.codex/*`、`~/.claude/*`、`~/.gemini/*`）。
注意：`codex` 的 commands 固定写入 `~/.codex/prompts/`。

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
