# 修复version命令返回旧版本

当前 `nanospec --version` 输出固定为 `1.0.0`，与实际包版本（`package.json`）不一致。

目标：
1. 修复 CLI 版本号来源，确保 `nanospec --version` 始终反映当前安装包版本。
2. 补充回归测试，防止再次写死版本。
3. 同步更新用户文档与变更记录。
