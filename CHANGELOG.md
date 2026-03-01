# Changelog

## Unreleased

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
