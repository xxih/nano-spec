# Changelog

## Unreleased

### Added
- Added nine built-in NanoSpec skills under `src/static/skills/` to cover missing workflow capabilities: `nanospec-init`, `nanospec-run`, `nanospec-spec`, `nanospec-plan`, `nanospec-execute`, `nanospec-clarify`, `nanospec-accept`, `nanospec-summary`, and `nanospec-onboard`.

### Changed
- Expanded skills regression coverage in `src/adapters/utils.test.ts` to enforce a full core-skill set and prevent partial-coverage regressions.
- Updated `README.md` with a built-in skills coverage matrix and a `skills`-only sync example for command-independent usage.

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
