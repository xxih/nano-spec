# Changelog

## Unreleased

### Changed
- 将内置 `nanospec` skill 及其 `references/` 参考稿全部改为中文说明。
- 更新 `nanospec` skill 的 init/run/onboard 流程，明确可以在未安装 `nanospec` CLI 的仓库中直接按目录结构运行。
- 在 `nanospec` skill 与 README 中补充任务目录结构说明，并为项目内 `.codex` skill 副本增加同步约束。
- 强化 `align` 在 `nanospec` skill 中的优先级：出现偏差或临时变更时，必须先完成对齐回写，再继续其他阶段。
- 为新建 NanoSpec 任务目录新增命名约束：必须使用 `YYYYMMDD-任务主题` 时间前缀格式。
- 重定义 `nanospec` skill 定位：默认提供 AI 工作中间文档目录规范与跨 skill 的 `align` 纠偏能力，完整 spec-driven workflow 改为按需路由。
- 在 `nanospec` skill 的 `SKILL.md` 中补充 align 机制说明，并明确支持通过 `/xxx` 将请求路由到对应阶段。
- 为 `nanospec` skill 增加更易跨环境复用的 `scripts/create_task_skeleton.py`，用于创建任务骨架并可选更新 `.nanospec/.current`。

### Added
- 为发布态 `nanospec` skill 与项目内 `.codex` 副本新增回归测试，约束两者保持同步、保持中文说明，并避免重新引入 CLI 硬依赖。

## 1.3.4 (2026-03-05)

### Fixed
- Fixed built-in `nanospec` skill frontmatter in `src/static/skills/nanospec/SKILL.md` by quoting `description`, so YAML parsers can load it reliably.

## 1.3.3 (2026-03-05)

### Changed
- Merged multiple NanoSpec skills into a single built-in `nanospec` skill with progressive disclosure via `references/`.
- Simplified README skill instructions to installation-focused guidance (`nanospec sync` and `$skill-installer install`).
- Updated README installation source path to `src/static/skills/nanospec` and removed MCP/CLI fallback guidance.
- Updated README natural-language install example to include the explicit GitHub source link.

## 1.3.2 (2026-03-03)

### Changed
- Changed `codex` command sync target to user-level only: commands now always write to `~/.codex/prompts/`, and `--scope project` is ignored for Codex prompts.
- Updated docs and defaults to match the new behavior (`codex_scope` default is now `user`).

### Added
- Added regression coverage to ensure Codex commands still route to user scope when `--scope project` is provided.

## 1.3.1 (2026-03-01)

### Added
- Added `gemini` adapter support with scoped command output: `./.gemini/commands/` (`project`) or `~/.gemini/commands/` (`user`).
- Added Claude Code skills sync support to `.claude/skills/` (project/user scope).
- Added regression tests for `gemini` adapter and Claude Code skills sync path behavior.

### Changed
- Updated GitHub Copilot output path to `.github/prompts/` and command file naming to `*.prompt.md` to align with prompt-file conventions.
- Expanded `--scope` handling beyond Codex to cover other scoped adapters (currently `claude-code` and `gemini`) while keeping the existing `codex_scope` config key for backward compatibility.
- Updated README adapter path matrix and skills coverage notes for Codex/Claude Code/Gemini/Copilot.

### Fixed
- Fixed CLI version output source: `nanospec --version` now reads from `package.json` instead of a hardcoded value (`1.0.0`), so installed output matches the actual package version.

## 1.3.0 (2026-03-01)

### Added
- Added nine built-in NanoSpec skills under `src/static/skills/` to cover missing workflow capabilities: `nanospec-init`, `nanospec-run`, `nanospec-spec`, `nanospec-plan`, `nanospec-execute`, `nanospec-clarify`, `nanospec-accept`, `nanospec-summary`, and `nanospec-onboard`.

### Changed
- Expanded skills regression coverage in `src/adapters/utils.test.ts` to enforce a full core-skill set and prevent partial-coverage regressions.
- Updated `README.md` with a built-in skills coverage matrix and a `skills`-only sync example for command-independent usage.
- Updated project-level workflow baseline in `AGENTS.md` to require at least one validated commit before task completion responses.

## 1.2.1 (2026-03-01)

### Changed
- Relaxed project-level commit cadence guidance in `AGENTS.md` from hard enforcement to a lightweight recommendation model, while keeping core history-safety constraints.

## 1.2.0 (2026-03-01)

### Changed
- Expanded asset model from command-only to `commands | skills | both` in `init` and `sync`.
- Added Codex scope routing (`project|user`) so assets can be generated to `./.codex/*` or `~/.codex/*`.
- Extended config with `default_assets`, `codex_scope`, and `enabled_skills`, and updated loader to read `.nanospec/config.json`.
- Updated README to document dual-asset sync and Codex scope options.

### Added
- Added built-in skills templates under `src/static/skills/` (`nanospec-workflow`, `nanospec-align`).
- Added skills utility functions and Codex adapter support for syncing skills to `.codex/skills/`.
- Added regression tests for new CLI options, config keys, skills discovery/copy, and Codex scope behavior.

## 1.1.3 (2026-03-01)

### Changed
- Hardened `/init` command template (`spec.init`) to require clarification when task name/intent cannot be extracted, and to block generic placeholder task names.
- Simplified `/init` command template (`spec.init`) by removing initialization-environment detection and keeping it focused on task creation flow.
- Improved CLI ergonomics: `nanospec new` now prompts interactively when no name is provided (supports Enter to use default name), and common commands now support short aliases (e.g. `nanospec s` for `switch`).
- Updated README with `/init` usage guidance for initialized projects (provide task name + one-line goal).
- Updated README command table with command aliases and interactive `new` behavior.
- Added a reusable commit-cadence prompt to the project-level `AGENTS.md`, so agents keep small, stage-based commits during execution.

### Added
- Added template regression test to ensure `spec.init` keeps the clarification gate before running `nanospec new`.
- Added CLI registration tests to lock top-level command aliases.
- Added `new` command regression coverage for no-arg interactive naming flow.

## 1.1.2 (2026-03-01)

### Changed
- Simplified internal CI/CD docs under `guides/` to one authoritative release flow aligned with `.github/workflows/release.yml`.
- Updated project-level `AGENTS.md` with a stricter release SOP (CI/CD tag release, preflight checks, and package content verification).
- Added an optional multi-agent collaboration SOP in `AGENTS.md`, including timestamped branch/worktree naming to avoid conflicts.
- Replaced legacy `specflow` references with `nanospec` in built-in slash command templates (`spec.init` and `spec.run`).

### Added
- Added regression tests for command templates to prevent reintroducing `specflow` references.

## 1.1.1 (2026-03-01)

### Added
- Added `codex` adapter support, which generates command files to `.codex/commands/`.
- Added unit tests for `codex` adapter (`src/adapters/codex.test.ts`).

### Changed
- Updated adapter registry and related tests to include `codex`.
- Updated config validation to use dynamic adapter list from registry, so `default_adapter: "codex"` is valid.
- Updated README AI tool lists and `--ai` available values to include `codex`.
- Simplified `README.md` into a concise user-facing guide and removed duplicated sections.
- Renamed internal maintainer docs directory from `docs/` to `guides/` and added `guides/README.md` index.
- Cleaned build output before compilation to avoid stale artifacts in published package.
