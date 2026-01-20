## 1. 更新 AGENTS.md

- [x] 1.1 读取 `assets/核心prompt/AGENTS.md` 内容
- [x] 1.2 备份当前 `specflow/AGENTS.md`
- [x] 1.3 用新内容替换 `specflow/AGENTS.md`（已验证内容一致，无需替换）
- [x] 1.4 验证文件格式正确，包含所有章节

## 2. 更新 flow.1-spec.toml

- [x] 2.1 读取 `assets/核心prompt/flow.1-spec.md` 内容
- [x] 2.2 读取当前 `.iflow/commands/flow.1-spec.toml`
- [x] 2.3 将完整 prompt 内嵌到 `prompt` 字段中
- [x] 2.4 保留 TOML 的 header 部分（description、version 等）
- [x] 2.5 验证 prompt 包含 Role、Objective、Inputs、Rules、Output、Checklist

## 3. 更新 flow.2-plan.toml

- [x] 3.1 读取 `assets/核心prompt/flow.2-plan.md` 内容
- [x] 3.2 读取当前 `.iflow/commands/flow.2-plan.toml`
- [x] 3.3 将完整 prompt 内嵌到 `prompt` 字段中
- [x] 3.4 保留 TOML 的 header 部分
- [x] 3.5 验证 prompt 结构完整

## 4. 更新 flow.3-execute.toml

- [x] 4.1 读取 `assets/核心prompt/flow.3-execute.md` 内容
- [x] 4.2 读取当前 `.iflow/commands/flow.3-execute.toml`
- [x] 4.3 将完整 prompt 内嵌到 `prompt` 字段中（已验证内容一致，无需更新）
- [x] 4.4 保留 TOML 的 header 部分
- [x] 4.5 验证 prompt 结构完整

## 5. 更新 flow.accept.toml

- [x] 5.1 读取 `assets/核心prompt/flow.accept.md` 内容
- [x] 5.2 读取当前 `.iflow/commands/flow.accept.toml`
- [x] 5.3 将完整 prompt 内嵌到 `prompt` 字段中（已验证内容一致，无需更新）
- [x] 5.4 保留 TOML 的 header 部分
- [x] 5.5 验证 prompt 结构完整

## 6. 更新 flow.align.toml

- [x] 6.1 读取 `assets/核心prompt/flow.align.md` 内容
- [x] 6.2 读取当前 `.iflow/commands/flow.align.toml`
- [x] 6.3 将完整 prompt 内嵌到 `prompt` 字段中（已验证内容一致，无需更新）
- [x] 6.4 保留 TOML 的 header 部分
- [x] 6.5 验证 prompt 结构完整

## 7. 更新 flow.summary.toml

- [x] 7.1 读取 `assets/核心prompt/flow.summary.md` 内容
- [x] 7.2 读取当前 `.iflow/commands/flow.summary.toml`
- [x] 7.3 将完整 prompt 内嵌到 `prompt` 字段中（已验证内容一致，无需更新）
- [x] 7.4 保留 TOML 的 header 部分
- [x] 7.5 验证 prompt 结构完整

## 8. 清理 src/templates 目录

- [x] 8.1 删除 `src/templates/AGENTS.md`（已被根目录 AGENTS.md 替代）
- [x] 8.2 删除 `src/templates/commands/` 目录（commands 不支持定制）
- [x] 8.3 删除 `src/templates/outputs/1-spec.md`（已在命令中内嵌）
- [x] 8.4 保留 `src/templates/outputs/` 下的其他模板文件作为参考

## 9. 验证更新效果

- [x] 9.1 检查 `specflow/AGENTS.md` 格式正确
- [x] 9.2 检查所有 `.iflow/commands/flow.*.toml` 的 prompt 字段内容完整
- [x] 9.3 确认 `templates/` 目录仅包含输出产物模板文件（若存在）（当前不存在）
- [x] 9.4 确认所有文档引用路径正确

## 10. 功能测试

- [x] 10.1 执行 `/flow.1-spec` 命令测试（已验证生成的 1-spec.md 格式正确）
- [x] 10.2 验证生成的 `1-spec.md` 为标准 Markdown 格式（已验证，格式正确）
- [x] 10.3 执行 `/flow.2-plan` 命令测试（已验证生成的 2-plan.md 和 3-tasks.md 格式正确）
- [x] 10.4 验证生成的 `2-plan.md` 和 `3-tasks.md` 为标准 Markdown 格式（已验证，格式正确）
- [x] 10.5 确认产物不包含 TOML 配置文本（已验证，无 TOML 文本）
- [x] 10.6 确认产物结构与模板定义一致（已验证，结构一致）