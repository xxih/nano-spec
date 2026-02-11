# Ralph 技术集成 - 任务清单

## 已完成对齐

- [x] **[对齐]** 确认使用 prd.json 作为核心状态对象 `@2026-02-11`
- [x] **[对齐]** 确认 Ralph-Aware AI 系统提示设计 `@2026-02-11`
- [x] **[对齐]** 确认外层控制器实现方案（Python → TypeScript） `@2026-02-11`
- [x] **[变更]** 技术栈统一使用 TypeScript，移除 CLI command 设计 `@2026-02-11`
- [x] **[简化]** 移除归档机制、仅支持 iflow、任务创建由内层 AI 负责 `@2026-02-11`
- [x] 更新 1-spec.md，整合 prd.json 核心架构和 TS 脚本设计

## 后续工作步骤

### Phase 1: 核心数据模型

- [ ] 设计 prd.json 数据结构（TypeScript 接口）
- [ ] 实现 prd.json 验证器（JSON Schema）
- [ ] 实现 prd.json 读写工具函数
- [ ] 实现任务状态管理工具函数

### Phase 2: Ralph 脚本（scripts/ralph.ts）

- [ ] 设计 scripts/ralph.ts 脚本结构
- [ ] 实现循环调用 iflow（while true）
- [ ] 实现时间限制策略（5 分钟后强制终止）
- [ ] 实现实时输出 iflow 的 stdout 和 stderr
- [ ] 实现进程正确终止（避免僵尸进程）
- [ ] 实现参数解析（环境变量：RALPH_TIME_LIMIT）
- [ ] 添加错误处理和日志输出
- [ ] 实现 Ctrl+C 优雅退出

### Phase 3: 斜杠命令

- [ ] 创建 `/spec.ralph-status` 斜杠命令
- [ ] 创建 `/spec.ralph-add` 斜杠命令
- [ ] 创建 `/spec.ralph-sync` 斜杠命令
- [ ] 创建 `/spec.ralph-complete` 斜杠命令

### Phase 4: 内层 AI 系统提示

- [ ] 创建系统提示模板文件（用于 iflow）
- [ ] 实现系统提示注入机制（在 iflow 中使用）
- [ ] 更新 prd.json 结构，添加 ralph_instruction 字段

### Phase 5: 集成测试

- [ ] 编写 prd.json 单元测试
- [ ] 编写 ralph.ts 流程测试（时间限制、进程终止）
- [ ] 编写 iflow 调用测试
- [ ] 编写端到端集成测试（模拟完整循环）

### Phase 6: 文档和示例

- [ ] 更新 README.md，添加 Ralph 使用说明
- [ ] 创建 prd.json 示例文件
- [ ] 创建 ralph.ts 使用示例

### Phase 7: 代码质量

- [ ] 运行类型检查（tsc）
- [ ] 运行 lint 检查
- [ ] 运行所有测试
- [ ] 更新 CHANGELOG.md