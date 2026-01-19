## 1. 项目初始化

- [x] 1.1 创建 package.json 配置文件（包含 Vitest 依赖）
- [x] 1.2 创建 tsconfig.json 配置文件
- [x] 1.3 创建 vitest.config.ts 配置文件
- [x] 1.4 创建 bin/specflow.js 入口文件
- [x] 1.5 创建 src/ 目录结构（commands/、adapters/、templates/）

## 2. CLI 框架搭建

- [x] 2.1 实现 src/index.ts CLI 入口（使用 commander）
- [x] 2.2 注册 init 子命令（--ai、--force 参数）
- [x] 2.3 注册 new 子命令（可选名称参数）
- [x] 2.4 验证 CLI 命令能正常解析参数

## 3. init 命令实现

- [x] 3.1 编写 src/commands/init.test.ts 测试（TDD：先写测试）
- [x] 3.2 实现 src/commands/init.ts 基础逻辑（通过测试）
- [x] 3.3 实现目录存在性检查和 --force 处理
- [x] 3.4 实现目录结构创建（specflow/、templates/）
- [x] 3.5 实现 AGENTS.md 复制逻辑
- [x] 3.6 实现 6 个产出物模板复制逻辑
- [x] 3.7 集成 AI 适配器调用
- [x] 3.8 实现初始化完成提示输出

## 4. new 命令实现

- [x] 4.1 编写 src/commands/new.test.ts 测试（TDD：先写测试）
- [x] 4.2 实现 src/commands/new.ts 基础逻辑（通过测试）
- [x] 4.3 实现初始化检查（specflow/ 目录存在性）
- [x] 4.4 实现日期戳目录名生成
- [x] 4.5 实现任务目录结构创建
- [x] 4.6 实现 brief.md 文件创建（含占位符）
- [x] 4.7 实现创建成功提示输出

## 5. AI 适配器架构

- [x] 5.1 定义 AIAdapter 接口（name、commandsDir、generateCommands）
- [x] 5.2 实现 src/adapters/index.ts 适配器注册表
- [x] 5.3 实现 getAdapter(name) 函数
- [x] 5.4 实现 listAdapters() 函数
- [x] 5.5 编写 src/adapters/index.test.ts 测试（TDD：先写测试）

## 6. Cursor 适配器实现

- [x] 6.1 编写 src/adapters/cursor.test.ts 测试（TDD：先写测试）
- [x] 6.2 实现 src/adapters/cursor.ts（通过测试）
- [x] 6.3 实现目录创建逻辑（.cursor/commands/）
- [x] 6.4 实现 6 个命令文件复制逻辑
- [x] 6.5 验证生成的命令文件内容正确

## 7. qwen 适配器实现

- [x] 7.1 编写 src/adapters/qwen.test.ts 测试（TDD：先写测试）
- [x] 7.2 实现 src/adapters/qwen.ts（通过测试）
- [x] 7.3 实现目录创建逻辑（.qwen/commands/）
- [x] 7.4 实现 6 个命令文件复制逻辑
- [x] 7.5 验证生成的命令文件格式符合 qwen 规范

## 8. iflow 适配器实现

- [x] 8.1 编写 src/adapters/iflow.test.ts 测试（TDD：先写测试）
- [x] 8.2 实现 src/adapters/iflow.ts（通过测试）
- [x] 8.3 实现目录创建逻辑（.iflow/commands/）
- [x] 8.4 实现 6 个 TOML 命令文件复制逻辑
- [x] 8.5 验证生成的 TOML 文件格式正确

## 9. cline 适配器实现

- [x] 9.1 编写 src/adapters/cline.test.ts 测试（TDD：先写测试）
- [x] 9.2 实现 src/adapters/cline.ts（通过测试）
- [x] 9.3 实现目录创建逻辑（.cline/commands/）
- [x] 9.4 实现 6 个命令文件复制逻辑
- [x] 9.5 验证生成的命令文件格式符合 cline 规范

## 10. 内置模板准备

- [x] 10.1 复制 AGENTS.md 到 src/templates/AGENTS.md
- [x] 10.2 复制 6 个 iflow 命令模板到 src/templates/commands/
- [x] 10.3 复制 6 个产出物模板到 src/templates/outputs/
- [x] 10.4 验证所有模板文件内容完整

## 11. 错误处理与用户体验

- [x] 11.1 实现目录已存在警告提示
- [x] 11.2 实现不支持 AI 工具错误提示
- [x] 11.3 实现未初始化错误提示
- [x] 11.4 实现所有操作的成功/失败反馈
- [x] 11.5 优化输出信息格式和可读性

## 12. 构建与测试

- [x] 12.1 配置 npm run build 脚本
- [x] 12.2 配置 npm run dev 脚本
- [x] 12.3 配置 npm test 脚本（运行 Vitest 测试）
- [x] 12.4 配置 npm run test:watch 脚本（监听模式）
- [x] 12.5 配置 npm run test:coverage 脚本（生成覆盖率报告）
- [x] 12.6 测试 specflow init（默认 Cursor）
- [x] 12.7 测试 specflow init --ai qwen
- [x] 12.8 测试 specflow init --ai iflow
- [x] 12.9 测试 specflow init --ai cline
- [x] 12.10 测试 specflow init --force
- [x] 12.11 测试 specflow new 创建任务目录
- [x] 12.12 验证所有生成的文件和目录结构
- [x] 12.13 验证 TypeScript 类型检查通过
- [x] 12.14 验证代码规模控制在 300 行左右
- [x] 12.15 验证所有测试通过
- [x] 12.16 验证测试覆盖率 ≥80%