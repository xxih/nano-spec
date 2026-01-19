# SpecFlow CLI 规格说明

> 版本: 1.0.0
> 基于文档: brief.md, assets/实现方案.md, assets/spec.md
> 日期: 2026-01-20

---

## 1. 项目概述

### 1.1 项目名称
SpecFlow CLI - Spec 驱动开发工作流脚手架

### 1.2 项目定位
一个极简的 CLI 工具，用于快速初始化 Spec 驱动开发工作流的项目结构，支持多种 AI 工具（Cursor、Claude 等）的命令文件生成。

### 1.3 核心价值
- **极简优先**：只有 6 个斜杠命令，CLI 只做初始化
- **即开即用**：`specflow init` 一键初始化，立即可用
- **多 AI 适配**：支持生成不同 AI 工具的命令文件
- **可定制**：通过修改模板和追加公共文档实现定制

---

## 2. 功能需求

### 2.1 核心功能

#### 2.1.1 specflow init 命令

**描述**：初始化 SpecFlow 项目结构

**功能点**：
1. 创建 `specflow/` 目录结构
2. 复制内置模板文件（AGENTS.md、产出物模板）
3. 生成 AI 工具的斜杠命令文件
4. 支持强制覆盖已存在文件

**参数**：
- `--ai <tool>`：指定 AI 工具类型（默认：cursor）
  - 支持：cursor, claude, qwen, iflow, cline
- `-f, --force`：强制覆盖已存在的文件

**验收标准**：
- [ ] 执行后在项目根目录创建 `specflow/` 目录
- [ ] `specflow/AGENTS.md` 文件存在且内容完整
- [ ] `specflow/templates/` 目录包含 6 个产出物模板文件
- [ ] 根据指定的 AI 工具创建对应的命令目录和文件
  - Cursor: `.cursor/commands/flow.*.md` (6 个文件)
  - Claude: `.claude/commands/flow.*.md` (6 个文件)
  - qwen: `.qwen/commands/flow.*.md` (6 个文件)
  - iflow: `.iflow/commands/flow.*.md` (6 个文件)
  - cline: `.cline/commands/flow.*.md` (6 个文件)
- [ ] 若目录已存在且未使用 `--force`，显示警告并退出
- [ ] 若指定了不支持的 AI 工具，显示错误信息并列出支持的选项

**输出示例**：
```
✓ 创建 specflow/AGENTS.md
✓ 创建 specflow/templates/ (6 个模板)
✓ 创建 .cursor/commands/ (6 个命令)

🎉 SpecFlow 初始化完成！

下一步：
  1. specflow new "任务名称"  创建任务目录
  2. 编辑 brief.md 描述需求
  3. 使用 /flow.1-spec 开始规格撰写
```

---

#### 2.1.2 specflow new 命令

**描述**：创建新的任务目录

**功能点**：
1. 生成带日期戳的任务目录名（格式：YYYYMMDD-名称）
2. 创建任务目录结构（brief.md、assets/、outputs/）
3. 创建空的 brief.md 文件

**参数**：
- `[name]`：任务名称（可选，默认："待命名"）

**验收标准**：
- [ ] 创建目录 `specflow/YYYYMMDD-<名称>/`
- [ ] 目录包含：`brief.md`、`assets/`、`outputs/`
- [ ] `brief.md` 包含任务名称标题和占位符文本
- [ ] 若未指定名称，使用"待命名"作为默认值
- [ ] 若目录已存在，显示警告并退出
- [ ] 若未执行 `specflow init`，显示错误信息

**输出示例**：
```
✓ 创建任务目录: specflow/20260120-用户认证功能/
  ├── brief.md
  ├── assets/
  └── outputs/

下一步：编辑 brief.md 描述需求，然后使用 /flow.1-spec
```

---

### 2.2 AI 适配器

#### 2.2.1 Cursor 适配器

**描述**：生成 Cursor IDE 的斜杠命令文件

**功能点**：
1. 复制内置命令模板到 `.cursor/commands/`
2. 支持 6 个命令文件

**验收标准**：
- [ ] 创建 `.cursor/commands/` 目录
- [ ] 生成 6 个命令文件：
  - `flow.1-spec.md`
  - `flow.2-plan.md`
  - `flow.3-execute.md`
  - `flow.accept.md`
  - `flow.align.md`
  - `flow.summary.md`
- [ ] 命令文件内容与内置模板一致

---

#### 2.2.2 Claude 适配器

**描述**：生成 Claude AI 的斜杠命令文件（Phase 2）

**功能点**：
1. 转换 Cursor 命令格式到 Claude 格式
2. 参考 spec-kit 代码仓库实现格式转换

**验收标准**：
- [ ] 创建 `.claude/commands/` 目录
- [ ] 生成 6 个命令文件
- [ ] 命令文件格式符合 Claude 规范
- [ ] [待澄清] Claude 命令格式规范需要参考 spec-kit 代码仓库确认

---

#### 2.2.3 qwen 适配器

**描述**：生成 qwen AI 的斜杠命令文件

**功能点**：
1. 转换 Cursor 命令格式到 qwen 格式
2. 支持 qwen 的命令规范

**验收标准**：
- [ ] 创建 `.qwen/commands/` 目录
- [ ] 生成 6 个命令文件
- [ ] 命令文件格式符合 qwen 规范
- [ ] [待澄清] qwen 命令格式规范需要确认

---

#### 2.2.4 iflow 适配器

**描述**：生成 iflow AI 的斜杠命令文件

**功能点**：
1. 转换 Cursor 命令格式到 iflow 格式
2. 支持 iflow 的命令规范（TOML 格式）

**验收标准**：
- [ ] 创建 `.iflow/commands/` 目录
- [ ] 生成 6 个命令文件（.toml 格式）
- [ ] 命令文件格式符合 iflow 规范
- [ ] [待澄清] iflow 命令格式规范需要确认

---

#### 2.2.5 cline 适配器

**描述**：生成 cline AI 的斜杠命令文件

**功能点**：
1. 转换 Cursor 命令格式到 cline 格式
2. 支持 cline 的命令规范

**验收标准**：
- [ ] 创建 `.cline/commands/` 目录
- [ ] 生成 6 个命令文件
- [ ] 命令文件格式符合 cline 规范
- [ ] [待澄清] cline 命令格式规范需要确认

---

### 2.3 内置模板

#### 2.3.1 AGENTS.md

**描述**：通用规则文档，AI 会读取此文件

**内容结构**：
1. 变量定义
2. 强制规则
3. 目录结构
4. 输入优先级
5. 输出模板
6. 变更传播规则
7. 任务状态
8. 命令概览
9. 定制指南

**验收标准**：
- [ ] 包含完整的变量定义（cmd_prefix、specs_dir、task_name）
- [ ] 明确强制规则（默认不创建 alignment.md，只在发现冲突/缺失/歧义/偏差时创建）
- [ ] 完整的目录结构说明
- [ ] 输入优先级规则清晰
- [ ] 变更传播规则明确

---

#### 2.3.2 产出物模板（6 个）

**描述**：任务产出物的结构模板

**模板清单**：
1. `1-spec.md` - 规格文档结构
2. `2-plan.md` - 技术方案结构
3. `3-tasks.md` - 任务清单格式
4. `acceptance.md` - 验收用例格式
5. `alignment.md` - 对齐记录格式
6. `summary.md` - 总结文档格式

**验收标准**：
- [ ] 每个模板文件存在且格式正确
- [ ] 模板包含必要的字段和结构说明
- [ ] 模板从 `assets/templates/` 复制到 `specflow/templates/`

---

#### 2.3.3 斜杠命令模板（6 个）

**描述**：AI 工具的斜杠命令定义

**命令清单**：
1. `flow.1-spec.md` - 规格撰写
2. `flow.2-plan.md` - 方案 + 任务拆解
3. `flow.3-execute.md` - 执行交付
4. `flow.accept.md` - 验收用例
5. `flow.align.md` - 对齐纠偏
6. `flow.summary.md` - 总结沉淀

**验收标准**：
- [ ] 每个命令文件包含明确的角色定义
- [ ] 每个命令包含 Objective、Rules、Output、Checklist
- [ ] 命令之间遵循输入优先级规则（alignment.md > brief.md > assets/* > 现状）
- [ ] 命令模板从内置模板复制到对应的 AI 工具目录

---

## 3. 非功能需求

### 3.1 技术栈

**要求**：
- 语言：TypeScript
- 运行时：Node.js (>=18)
- CLI 框架：commander
- 构建工具：tsc
- 测试框架：Vitest（TDD 开发方式）

**验收标准**：
- [ ] 项目使用 TypeScript 开发
- [ ] 支持 ES2022 模块
- [ ] package.json 配置正确
- [ ] tsconfig.json 配置正确
- [ ] Vitest 测试框架配置正确

---

### 3.2 代码规模

**要求**：极简实现，目标约 300 行代码

**验收标准**：
- [ ] 核心代码行数控制在 300 行左右（不含模板文件）
- [ ] 避免不必要的抽象和复杂度
- [ ] 优先使用 Node.js 内置模块

---

### 3.3 安装方式

**要求**：支持全局安装

**验收标准**：
- [ ] package.json 包含正确的 bin 配置
- [ ] `npm install -g specflow-cli` 后可直接运行 `specflow` 命令
- [ ] bin/specflow.js 正确引导到 dist/index.js

---

### 3.4 开发体验

**要求**：支持开发模式和测试

**验收标准**：
- [ ] package.json 包含 `dev` 脚本（使用 tsx）
- [ ] package.json 包含 `build` 脚本（使用 tsc）
- [ ] package.json 包含 `test` 脚本（运行 Vitest 测试）
- [ ] package.json 包含 `test:watch` 脚本（监听模式运行测试）
- [ ] package.json 包含 `test:coverage` 脚本（生成测试覆盖率报告）
- [ ] 开发时可直接运行 `npm run dev`
- [ ] 测试覆盖率 ≥80%

---

## 4. 项目结构

### 4.1 目录结构

**要求**：
```
specflow-cli/
├── package.json
├── tsconfig.json
├── vitest.config.ts
├── src/
│   ├── index.ts              # CLI 入口
│   ├── commands/
│   │   ├── init.ts           # specflow init
│   │   ├── init.test.ts      # init 命令测试
│   │   ├── new.ts            # specflow new
│   │   └── new.test.ts       # new 命令测试
│   ├── adapters/             # AI 适配器
│   │   ├── index.ts          # 适配器注册
│   │   ├── index.test.ts     # 适配器注册测试
│   │   ├── cursor.ts         # Cursor 命令生成
│   │   ├── cursor.test.ts    # Cursor 适配器测试
│   │   ├── claude.ts         # Claude 命令生成
│   │   ├── qwen.ts           # qwen 命令生成
│   │   ├── qwen.test.ts      # qwen 适配器测试
│   │   ├── iflow.ts          # iflow 命令生成
│   │   ├── iflow.test.ts     # iflow 适配器测试
│   │   ├── cline.ts          # cline 命令生成
│   │   └── cline.test.ts     # cline 适配器测试
│   └── templates/            # 内置模板
│       ├── AGENTS.md
│       ├── commands/
│       │   ├── flow.1-spec.md
│       │   ├── flow.2-plan.md
│       │   ├── flow.3-execute.md
│       │   ├── flow.accept.md
│       │   ├── flow.align.md
│       │   └── flow.summary.md
│       └── outputs/
│           ├── 1-spec.md
│           ├── 2-plan.md
│           ├── 3-tasks.md
│           ├── acceptance.md
│           ├── alignment.md
│           └── summary.md
└── bin/
    └── specflow.js
```

**验收标准**：
- [ ] 目录结构符合上述设计
- [ ] 所有必需的文件和目录存在
- [ ] 文件命名规范一致
- [ ] 测试文件与源码文件同目录，命名规范：`*.test.ts`

---

### 4.2 适配器接口

**要求**：定义统一的适配器接口

**接口定义**：
```typescript
interface AIAdapter {
  name: string;
  commandsDir: string;
  generateCommands(cwd: string, templatesDir: string): void;
}
```

**验收标准**：
- [ ] 定义 AIAdapter 接口
- [ ] 实现适配器注册机制
- [ ] 支持动态获取适配器

---

## 5. 依赖项

### 5.1 生产依赖

| 包名 | 版本 | 用途 |
| --- | --- | --- |
| commander | ^12.0.0 | CLI 框架 |

**验收标准**：
- [ ] package.json 包含正确的依赖项
- [ ] 依赖版本符合要求

---

### 5.2 开发依赖

| 包名 | 版本 | 用途 |
| --- | --- | --- |
| @types/node | ^22.0.0 | Node.js 类型定义 |
| typescript | ^5.5.0 | TypeScript 编译器 |
| tsx | ^4.0.0 | TypeScript 执行器 |
| vitest | ^2.0.0 | 测试框架 |
| @vitest/coverage-v8 | ^2.0.0 | Vitest 覆盖率工具 |

**验收标准**：
- [ ] package.json 包含正确的开发依赖
- [ ] 依赖版本符合要求

---

## 6. 待澄清项

### 6.1 Claude 适配器

- [ ] Claude 命令格式规范需要参考 spec-kit 代码仓库确认
- [ ] Cursor 到 Claude 的格式转换逻辑需要明确

### 6.2 其他 AI 工具

- [ ] qwen 的命令格式和适配方式需要调研
- [ ] iflow 的命令格式和适配方式需要调研
- [ ] cline 的命令格式和适配方式需要调研
- [ ] GitHub Copilot 的命令格式和适配方式需要调研（可选）

---

## 7. 冲突与偏差

### 7.1 当前无冲突

经过分析，brief.md 和 assets/* 中的文档信息一致，未发现冲突。

---

## 8. 验收标准总结

### 8.1 功能验收

- [ ] `specflow init` 命令正常工作
- [ ] `specflow new` 命令正常工作
- [ ] Cursor 适配器正常工作
- [ ] 所有模板文件正确生成
- [ ] 错误处理完善

### 8.2 非功能验收

- [ ] 代码规模控制在 300 行左右
- [ ] 支持全局安装
- [ ] 支持开发模式
- [ ] TypeScript 类型检查通过
- [ ] 代码风格一致
- [ ] 单元测试覆盖核心功能
- [ ] 测试覆盖率 ≥80%
- [ ] 所有测试通过

### 8.3 文档验收

- [ ] README.md 完整
- [ ] 使用示例清晰
- [ ] API 文档（如有）完整

---

## 9. 后续迭代

### 9.1 Phase 2 功能

- [ ] Claude 适配器实现
- [ ] qwen 适配器实现
- [ ] iflow 适配器实现
- [ ] cline 适配器实现
- [ ] GitHub Copilot 适配器实现（可选）
- [ ] 模板变量替换支持

### 9.2 Phase 3 功能

- [ ] 配置文件支持（.specflowrc）
- [ ] 配置市场
- [ ] 配置验证工具

---

## 10. 参考资料

- `brief.md` - 需求描述
- `assets/实现方案.md` - 技术实现方案
- `assets/spec.md` - 框架设计文档
- `assets/templates/` - 产出物模板（6 个文件）
- `specflow/AGENTS.md` - 通用规则
- spec-kit 代码仓库 - Claude 适配器参考实现