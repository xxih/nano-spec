# 规格说明：修复 `nanospec --version` 返回旧版本

## 背景与目标

当前 CLI 在 `src/index.ts` 中将版本号写死为 `1.0.0`，导致 `nanospec --version` 与实际安装包版本不一致。

目标是让版本号动态来自包元数据（`package.json`），确保发布后无需手改代码即可正确显示版本。

## 范围

1. 修复 CLI 版本号读取逻辑。
2. 增加单测验证 CLI 注册的版本号等于包版本。
3. 更新 README 和 CHANGELOG（Unreleased）保证文档一致。

## 验收标准

1. 运行 `nanospec --version` 输出与 `package.json` 中 `version` 一致。
2. `src/index.test.ts` 存在针对版本号来源的回归测试，且通过。
3. README 明确说明 `-V, --version` 用于查看当前安装版本。
4. CHANGELOG 的 Unreleased 记录此次修复。

## 约束

1. 不改动已有命令语义，仅修复版本来源。
2. 依赖保持最小，不新增额外第三方包。
