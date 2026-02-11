# Ralph 技术集成 - 任务清单

## 已完成对齐

- [x] **[对齐]** 确认使用 prd.json 作为核心状态对象 `@2026-02-11`
- [x] **[对齐]** 确认 Ralph-Aware AI 系统提示设计 `@2026-02-11`
- [x] **[对齐]** 确认外层控制器实现方案 `@2026-02-11`
- [x] 更新 1-spec.md，整合 prd.json 核心架构

## 后续工作步骤

### Phase 1: 核心数据模型

- [ ] 设计 prd.json 数据结构（TypeScript 接口）
- [ ] 实现 prd.json 验证器（JSON Schema）
- [ ] 实现 prd.json 读写工具函数
- [ ] 实现任务状态管理工具函数

### Phase 2: AI 系统提示

- [ ] 创建系统提示模板文件
- [ ] 实现系统提示注入机制
- [ ] 在 `nanospec switch` 时注入系统提示
- [ ] 在 `/spec.*` 命令中携带系统提示上下文

### Phase 3: 外层控制器

- [ ] 设计 ralph_runner.py 脚本结构
- [ ] 实现任务选择逻辑
- [ ] 实现上下文注入逻辑
- [ ] 实现 AI 启动和监控
- [ ] 实现 Kill 策略（时间限制 / 不活跃检测）
- [ ] 实现循环控制逻辑

### Phase 4: CLI 命令

- [ ] 实现 `nanospec ralph init` 命令
- [ ] 实现 `nanospec ralph start` 命令
- [ ] 实现 `nanospec ralph stop` 命令
- [ ] 实现 `nanospec ralph status` 命令
- [ ] 实现 `nanospec ralph resume` 命令
- [ ] 实现 `nanospec ralph summary` 命令

### Phase 5: 斜杠命令

- [ ] 创建 `/spec.ralph-init` 斜杠命令
- [ ] 创建 `/spec.ralph-status` 斜杠命令
- [ ] 创建 `/spec.ralph-decompose` 斜杠命令
- [ ] 创建 `/spec.ralph-next` 斜杠命令
- [ ] 创建 `/spec.ralph-add` 斜杠命令
- [ ] 创建 `/spec.ralph-sync` 斜杠命令

### Phase 6: 集成测试

- [ ] 编写 prd.json 单元测试
- [ ] 编写系统提示注入测试
- [ ] 编写控制器流程测试
- [ ] 编写端到端集成测试

### Phase 7: 文档和示例

- [ ] 更新 README.md，添加 Ralph 使用说明
- [ ] 创建 prd.json 示例文件
- [ ] 创建系统提示模板示例
- [ ] 创建控制器使用示例

### Phase 8: 代码质量

- [ ] 运行类型检查
- [ ] 运行 lint 检查
- [ ] 运行所有测试
- [ ] 更新 CHANGELOG.md