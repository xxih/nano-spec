# 规格说明：项目更名为 nano-spec

## 背景与目标

将整个 nanospec-cli 项目更名为 **nano-spec**，以更好地反映其"最小化、轻量级"的设计理念。同时将命令前缀从 `flow.` 改为 `spec.`，使命名更加简洁直观。

## 核心组成

```
更名范围
├── 命令前缀
│   ├── flow.1-spec → spec.1-spec
│   ├── flow.2-plan → spec.2-plan
│   ├── flow.3-execute → spec.3-execute
│   ├── flow.accept → spec.accept
│   ├── flow.align → spec.align
│   └── flow.summary → spec.summary
├── 文件名引用
│   ├── 所有 TOML 配置文件
│   ├── 所有测试文件
│   ├── 所有文档和注释
│   └── 所有代码中的字符串引用
└── 项目元数据
    ├── package.json (name: "nanospec-cli" → "nano-spec-cli")
    ├── README.md (标题和描述)
    └── 代码仓库配置
```

## 成功标志

### 验收标准

1. **命令前缀替换**
   - [ ] 所有 `.iflow/commands/*.toml` 文件名从 `flow.*` 改为 `spec.*`
   - [ ] 所有适配器代码中的命令数组从 `flow.*` 改为 `spec.*`
   - [ ] 所有测试文件中的命令引用从 `flow.*` 改为 `spec.*`

2. **文档更新**
   - [ ] README.md 中所有 `flow.` 引用改为 `spec.`
   - [ ] README.md 中 "nanospec" 改为 "nano-spec"
   - [ ] 所有任务文档（1-spec.md, 2-plan.md, 3-tasks.md）中的引用已更新
   - [ ] AGENTS.md 中的变量定义 `<cmd_prefix>` 值改为 `spec`

3. **代码更新**
   - [ ] package.json 中的 name 字段改为 "nano-spec-cli"
   - [ ] package.json 中的 description 更新
   - [ ] 所有 .ts 源文件中的字符串引用已更新
   - [ ] 所有注释中的引用已更新

4. **功能验证**
   - [ ] `npm run build` 成功，无编译错误
   - [ ] `npm test` 全部通过
   - [ ] 生成的命令文件名正确（spec.\*）
   - [ ] 命令内容中的引用正确

## 约束与注意

> 必须遵守的限制条件

- [ ] **风格/规范**：保持代码风格一致，仅替换名称，不改变逻辑
- [ ] **依赖项**：确保所有文件引用路径正确，避免因更名导致的路径错误
- [ ] **向后兼容**：考虑是否需要提供迁移指南或兼容性说明（本次更名不考虑向后兼容）
- [ ] **完整性**：确保所有 255 处 `flow.` 引用都被正确替换（基于搜索结果）
