# Ralph 技术集成 - 任务清单

## 已完成对齐

- [x] **[对齐]** 确认使用 prd.json 作为核心状态对象 `@2026-02-11`
- [x] **[对齐]** 确认 Ralph-Aware AI 系统提示设计 `@2026-02-11`
- [x] **[对齐]** 确认外层控制器实现方案（Python → TypeScript） `@2026-02-11`
- [x] **[变更]** 技术栈统一使用 TypeScript，移除 CLI command 设计 `@2026-02-11`
- [x] 更新 1-spec.md，整合 prd.json 核心架构和 TS 脚本设计

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

### Phase 3: Ralph 外层控制器脚本

- [ ] 设计 scripts/ralph.ts 脚本结构
- [ ] 实现多 AI 工具支持（amp/claude/iflow）
- [ ] 实现分支变更归档逻辑
- [ ] 实现分支跟踪逻辑
- [ ] 实现进度日志读写
- [ ] 实现 AI 工具调用（child_process）
- [ ] 实现循环控制逻辑
- [ ] 实现完成标志检测（`<promise>COMPLETE</promise>`）
- [ ] 实现参数解析（环境变量 + 配置文件）

### Phase 4: 辅助脚本（可选）

- [ ] 实现 scripts/ralph-init.ts（初始化 Ralph 环境）
- [ ] 实现 scripts/ralph-status.ts（查看 Ralph 状态）
- [ ] 实现 scripts/ralph-archive.ts（手动归档）

### Phase 5: 斜杠命令

- [ ] 创建 `/spec.ralph-status` 斜杠命令
- [ ] 创建 `/spec.ralph-add` 斜杠命令
- [ ] 创建 `/spec.ralph-sync` 斜杠命令
- [ ] 创建 `/spec.ralph-complete` 斜杠命令

### Phase 6: Prompt 模板

- [ ] 创建 prompt.md 模板（amp 工具）
- [ ] 创建 CLAUDE.md 模板（Claude 工具）
- [ ] 创建 IFLOW.md 模板（iFlow 工具）

### Phase 7: 集成测试

- [ ] 编写 prd.json 单元测试
- [ ] 编写 ralph.ts 流程测试
- [ ] 编写分支归档测试
- [ ] 编写 AI 工具调用测试
- [ ] 编写端到端集成测试

### Phase 8: 文档和示例

- [ ] 更新 README.md，添加 Ralph 使用说明
- [ ] 创建 prd.json 示例文件
- [ ] 创建系统提示模板示例
- [ ] 创建 ralph.ts 使用示例

### Phase 9: 代码质量

- [ ] 运行类型检查（tsc）
- [ ] 运行 lint 检查
- [ ] 运行所有测试
- [ ] 更新 CHANGELOG.md