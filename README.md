# NanoSpec CLI

轻量、可扩展的 Spec 驱动工作流工具。用统一流程把需求落成可执行任务：
`brief -> spec -> plan -> execute`。

## 3 分钟上手

```bash
# 1) 安装
npm install -g nano-spec

# 2) 初始化（默认交互式选择 AI 工具）
nanospec init

# 3) 创建任务
nanospec new "优化登录流程"
```

在 AI 工具中按顺序执行：

- `/spec.1-spec`：生成规格说明
- `/spec.2-plan`：生成实施方案与任务拆解
- `/spec.3-execute`：执行任务并更新状态

## 核心命令

| 命令 | 说明 |
|---|---|
| `nanospec init` | 初始化项目结构与命令模板 |
| `nanospec new [name]` | 创建任务目录并设为当前任务 |
| `nanospec switch [name]` | 切换当前任务 |
| `nanospec status` | 查看当前任务状态 |
| `nanospec sync [--adapter <name>]` | 同步命令到 AI 工具目录 |
| `nanospec preset list/install/uninstall` | 预设包管理 |
| `nanospec config` | 查看当前配置 |
| `nanospec config get/set/unset/list` | 读写配置（支持 `--global`） |

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

## 支持的 AI 工具

- `cursor`
- `codex`
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
└── .<ai-tool>/commands/
```

## 常见问题

### `nanospec init` 后没有命令文件？

运行：

```bash
nanospec sync
```

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
