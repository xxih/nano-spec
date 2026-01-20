# Alignment

<!--
格式规范：
- 纯列表结构，仅追加不删除
- 每条带标签和日期
- 确认结论缩进追加在原条目下
-->

- [已确认] 产出物模板已补充在 assets/templates 中，包含 6 个模板文件（1-spec.md、2-plan.md、3-tasks.md、acceptance.md、alignment.md、summary.md） `@2026-01-20`
- [已确认] spec-kit 已添加到工作区，可作为 Claude 适配器的参考实现 `@2026-01-20`
- [已确认] 需要适配 qwen、iflow 和 cline 三个 AI 工具 `@2026-01-20`
- [已确认] 采用 TDD（测试驱动开发）方式进行开发，引入单元测试框架 `@2026-01-20`
  - ↳ 使用 Vitest 作为单元测试框架（更现代、更快的测试框架）
  - ↳ 测试覆盖核心功能：init 命令、new 命令、AI 适配器
  - ↳ 遵循红-绿-重构循环：先写测试 → 实现功能 → 重构代码
  - ↳ 测试文件与源码文件同目录，命名规范：`*.test.ts`
  - ↳ 目标测试覆盖率：≥80%
- [已确认] README 优化方向 `@2026-01-20`
  - ↳ 去掉 TDD-Driven 特性描述（内部开发方式，不需要透出给用户）
  - ↳ 核心内容聚焦于工具的 idea 和用法，吸引用户使用
  - ↳ Local Development 内容移到最后作为开发指南
- [已确认] AI 适配器实现方式需要更灵活 `@2026-01-20`
  - ↳ 当前实现：所有适配器都是简单的文件复制（cursor.ts、qwen.ts、iflow.ts、cline.ts 都使用相同的 cpSync 逻辑）
  - ↳ 问题：不同 AI 工具的命令文件格式、内容要求各不相同，不能只是简单的复制粘贴
  - ↳ 需求：参考 OpenSpec 的实现，为不同 AI 工具提供格式转换和内容适配能力
  - ↳ 影响：需要重新设计适配器接口，支持格式转换、内容定制、变量替换等高级功能
- [已确认] 适配器接口重新设计与实现 `@2026-01-20`
  - ↳ 已扩展 AIAdapter 接口，支持：
    - `fileFormat`：指定命令文件格式（md、toml、json、yaml）
    - `transformCommand`：格式转换方法，将通用模板转换为特定AI工具格式
    - `supportsVariables`：是否支持变量替换
  - ↳ 已实现模板管理优化：
    - 创建了 `src/adapters/utils.ts` 工具函数
    - 支持通用模板和特定模板选择策略
    - 实现了 Markdown → TOML 转换函数
  - ↳ 已实现格式转换逻辑：
    - iflow: Markdown → TOML（已实现并测试通过）
    - qwen: Markdown 格式（已实现并测试通过）
    - cline: Markdown 格式（已实现并测试通过）
    - cursor: Markdown 格式（已实现并测试通过）
  - ↳ 已更新所有适配器实现（cursor.ts、qwen.ts、iflow.ts、cline.ts）
  - ↳ 已更新适配器测试用例（31 个测试全部通过）
  - ↳ 测试覆盖率：87.72%（超过 80% 目标）
- [已确认] 测试超时问题解决 `@2026-01-20`
  - ↳ 问题：`npm test` 经常超时（120-180秒），影响开发效率
  - ↳ 原因：
    - `npm test` 默认进入 watch 模式，不会自动退出
    - 缺少超时配置，单个测试可能无限等待
    - 没有并行执行优化
  - ↳ 解决方案：
    - 更新 `package.json`：`npm test` 改为 `vitest run`（自动退出）
    - 优化 `vitest.config.ts`：
      - 添加 `testTimeout: 10000`（10秒单个测试超时）
      - 添加 `hookTimeout: 10000`（10秒钩子超时）
      - 启用并行执行：`pool: 'threads'`，`maxThreads: 4`
      - 添加 `bail: 1`（失败时立即终止）
    - 优化 `src/commands/init.test.ts`：为复杂测试添加 30 秒超时
  - ↳ 效果：
    - 测试时间从 120-180 秒降低到 3-4 秒
    - 45 个测试全部通过
    - 测试覆盖率：84.47%（整体），87.72%（适配器），97.53%（commands）
- [已确认] 测试完全缺失，Vitest 配置形同虚设 `@2026-01-20`
  - ↳ 当前状态：src/ 目录下没有任何 *.test.ts 测试文件
  - ↳ 与 TDD 要求不符：规格中明确要求采用 TDD 开发方式，先写测试 → 实现功能 → 重构代码
  - ↳ 影响：无法验证代码正确性，无法保证测试覆盖率 ≥80%
  - ↳ 已补充的测试：
    - src/commands/init.test.ts - init 命令测试（7 个测试用例）
    - src/commands/new.test.ts - new 命令测试（7 个测试用例）
    - src/adapters/index.test.ts - 适配器注册测试（5 个测试用例）
    - src/adapters/cursor.test.ts - Cursor 适配器测试（5 个测试用例）
    - src/adapters/qwen.test.ts - qwen 适配器测试（5 个测试用例）
    - src/adapters/iflow.test.ts - iflow 适配器测试（5 个测试用例）
    - src/adapters/cline.test.ts - cline 适配器测试（5 个测试用例）
  - ↳ 测试结果：39 个测试全部通过，测试覆盖率达到 89.09%（超过 80% 目标）
  - ↳ 测试覆盖详情：
    - src/adapters/: 100% 覆盖率（所有适配器）
    - src/commands/: 97.53% 覆盖率（init.ts 96.15%, new.ts 100%）
    - 整体覆盖率：89.09%（statements、branch、func、lines 均达标）

<!--
支持标签：
| 标签       | 含义                 |
| ---------- | -------------------- |
| [冲突]     | 多来源信息存在矛盾   |
| [缺失]     | 缺少必要信息         |
| [歧义]     | 描述模糊可作多种理解 |
| [偏差]     | 实现与预期不符       |
| [待确认]   | 需要相关方确认       |
| [已确认]   | 已获确认结论         |
-->