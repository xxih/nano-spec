## 1. 更新 AGENTS.md

- [ ] 1.1 读取 `assets/核心prompt/AGENTS.md` 内容
- [ ] 1.2 备份当前 `specflow/AGENTS.md`
- [ ] 1.3 用新内容替换 `specflow/AGENTS.md`
- [ ] 1.4 验证文件格式正确，包含所有章节

## 2. 更新 flow.1-spec.toml

- [ ] 2.1 读取 `assets/核心prompt/flow.1-spec.md` 内容
- [ ] 2.2 读取当前 `.iflow/commands/flow.1-spec.toml`
- [ ] 2.3 将完整 prompt 内嵌到 `prompt` 字段中
- [ ] 2.4 保留 TOML 的 header 部分（description、version 等）
- [ ] 2.5 验证 prompt 包含 Role、Objective、Inputs、Rules、Output、Checklist

## 3. 更新 flow.2-plan.toml

- [ ] 3.1 读取 `assets/核心prompt/flow.2-plan.md` 内容
- [ ] 3.2 读取当前 `.iflow/commands/flow.2-plan.toml`
- [ ] 3.3 将完整 prompt 内嵌到 `prompt` 字段中
- [ ] 3.4 保留 TOML 的 header 部分
- [ ] 3.5 验证 prompt 结构完整

## 4. 更新 flow.3-execute.toml

- [ ] 4.1 读取 `assets/核心prompt/flow.3-execute.md` 内容
- [ ] 4.2 读取当前 `.iflow/commands/flow.3-execute.toml`
- [ ] 4.3 将完整 prompt 内嵌到 `prompt` 字段中
- [ ] 4.4 保留 TOML 的 header 部分
- [ ] 4.5 验证 prompt 结构完整

## 5. 更新 flow.accept.toml

- [ ] 5.1 读取 `assets/核心prompt/flow.accept.md` 内容
- [ ] 5.2 读取当前 `.iflow/commands/flow.accept.toml`
- [ ] 5.3 将完整 prompt 内嵌到 `prompt` 字段中
- [ ] 5.4 保留 TOML 的 header 部分
- [ ] 5.5 验证 prompt 结构完整

## 6. 更新 flow.align.toml

- [ ] 6.1 读取 `assets/核心prompt/flow.align.md` 内容
- [ ] 6.2 读取当前 `.iflow/commands/flow.align.toml`
- [ ] 6.3 将完整 prompt 内嵌到 `prompt` 字段中
- [ ] 6.4 保留 TOML 的 header 部分
- [ ] 6.5 验证 prompt 结构完整

## 7. 更新 flow.summary.toml

- [ ] 7.1 读取 `assets/核心prompt/flow.summary.md` 内容
- [ ] 7.2 读取当前 `.iflow/commands/flow.summary.toml`
- [ ] 7.3 将完整 prompt 内嵌到 `prompt` 字段中
- [ ] 7.4 保留 TOML 的 header 部分
- [ ] 7.5 验证 prompt 结构完整

## 8. 清理 src/templates 目录

- [ ] 8.1 删除 `src/templates/AGENTS.md`（已被根目录 AGENTS.md 替代）
- [ ] 8.2 删除 `src/templates/commands/` 目录（commands 不支持定制）
- [ ] 8.3 删除 `src/templates/outputs/1-spec.md`（已在命令中内嵌）
- [ ] 8.4 保留 `src/templates/outputs/` 下的其他模板文件作为参考

## 9. 验证更新效果

- [ ] 9.1 检查 `specflow/AGENTS.md` 格式正确
- [ ] 9.2 检查所有 `.iflow/commands/flow.*.toml` 的 prompt 字段内容完整
- [ ] 9.3 确认 `templates/` 目录仅包含输出产物模板文件（若存在）
- [ ] 9.4 确认所有文档引用路径正确

## 10. 功能测试

- [ ] 10.1 执行 `/flow.1-spec` 命令测试
- [ ] 10.2 验证生成的 `1-spec.md` 为标准 Markdown 格式
- [ ] 10.3 执行 `/flow.2-plan` 命令测试
- [ ] 10.4 验证生成的 `2-plan.md` 和 `3-tasks.md` 为标准 Markdown 格式
- [ ] 10.5 确认产物不包含 TOML 配置文本
- [ ] 10.6 确认产物结构与模板定义一致