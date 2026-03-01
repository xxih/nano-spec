# Changelog

## Unreleased

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
