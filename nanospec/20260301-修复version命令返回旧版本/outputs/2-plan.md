# 方案：修复 CLI 版本号来源

## 执行策略

1. 在 `src/index.ts` 中改为从 `package.json` 读取版本号并注入 commander 的 `.version(...)`。
2. 在 `src/index.test.ts` 增加断言，校验 `program.version()` 与 `package.json` 版本一致。
3. 在 `README.md` 的命令表补充 `-V, --version` 说明。
4. 在 `CHANGELOG.md` 的 Unreleased 追加本次修复记录。
5. 运行变更路径测试，确认无回归。

## 风险与应对

1. 风险：ESM 环境读取 JSON 兼容性问题。
应对：使用 Node 官方 `createRequire(import.meta.url)` 读取 `package.json`。

2. 风险：测试依赖 CLI 内部接口不稳定。
应对：仅依赖 `createProgram()` 和 `program.version()`，避免耦合 parse 细节。
