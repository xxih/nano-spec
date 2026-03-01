# 任务清单：路径修正、Skills 补齐与 Gemini 适配

## 1. 工作流与调研固化

- [x] 1.1 创建任务目录并写入 brief/spec/plan
- [x] 1.2 在实现前确认目标工具路径与 skills 支持结论

## 2. 适配器实现

- [x] 2.1 修正 copilot 输出目录与文件扩展名
- [x] 2.2 为 claude-code 增加 skills 生成与 scope 路径支持
- [x] 2.3 新增 gemini 适配器并注册

## 3. 命令层与测试

- [x] 3.1 更新 init/sync 的目标目录解析
- [x] 3.2 更新/新增相关单测（copilot、claude-code、gemini、index、init/sync）
- [x] 3.3 运行测试验证

## 4. 文档与收尾

- [x] 4.1 更新 README（路径、工具、skills 说明）
- [x] 4.2 更新 CHANGELOG
- [ ] 4.3 完成 commit 并回填任务状态
