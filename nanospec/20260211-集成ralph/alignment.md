# 对齐记录

## [变更] Ralph 架构定位 - 外层把控者 `@2026-02-11`

**问题描述**：之前的规格说明将 Ralph 定位为单个任务执行阶段的循环模式，这不符合用户的设计意图。

**新架构理解**：
- Ralph 是**外层的监控者/把控者**，而非嵌入到单个任务流程中
- 用户给出**宏观方向/目标**
- Ralph **自主创建多个子任务**（使用 `nanospec new`）
- 对每个子任务执行**完整的 NanoSpec 工作流**（1-spec → 2-plan → 3-execute）
- 循环直到所有外层目标完成

**影响范围**：
- 整个架构设计需要重构
- 1-spec.md 需要完全重写
- 需要新增"宏观目标"文件结构
- 任务创建和切换自动化是核心

---

## [歧义] 宏观目标的表达方式 `⏳ 待确认` `@2026-02-11`

**问题**：用户给出的"宏观方向"应该如何定义？

**选项/建议**：
1. 使用单独的 `ralph-goals.md` - 描述高层目标和成功标准
2. 使用 `prd.json` 格式 - 类似 Ralph 原始设计的 stories 结构
3. 扩展现有的 `brief.md` - 增加"目标分解"章节
4. 新增 JSON 配置文件 `ralph.config.json` - 结构化描述目标层次

---

## [歧义] 任务分解的策略 `⏳ 待确认` `@2026-02-11`

**问题**：Ralph 如何将宏观目标分解为具体子任务？

**选项/建议**：
1. Ralph 完全自主分解 - 基于目标的复杂度和依赖关系
2. 用户提供初步分解 - Ralph 负责细化
3. 混合模式 - Ralph 先分解，用户确认后再执行
4. 渐进式分解 - 完成一个子任务后，根据结果决定下一个

---

## [歧义] 子任务完成后的验证机制 `⏳ 待确认` `@2026-02-11`

**问题**：如何判断子任务是否"完成"且"正确"？

**选项/建议**：
1. 使用 acceptance.md 验收标准 - 每个子任务必须有验收用例
2. 自动化测试 - 运行项目测试套件
3. 质量检查 - typecheck + lint + test
4. AI 自我验证 - AI 评估是否满足目标
5. 组合方案 - 上述多种方式结合

---

## [歧义] 进度跟踪方式 `⏳ 待确认` `@2026-02-11`

**问题**：Ralph 如何跟踪整体进度和子任务状态？

**选项/建议**：
1. 使用 `progress.txt` - 记录每次迭代的详细日志
2. 使用状态文件 `ralph-state.json` - 结构化记录完成状态
3. 使用任务目录状态 - 检查各子任务的 outputs/ 文件
4. 混合方式 - progress.txt 记录日志 + JSON 记录状态

---

## [对齐] prd.json 核心架构方案 `@2026-02-11`

**用户确认的方案**：
- 使用 `prd.json` 作为 Ralph 和 AI 之间的共享内存（核心状态对象）
- 包含任务队列、当前焦点、phase 细分状态、progress_note
- 支持任务拆分、状态恢复、进度追踪

**prd.json 结构示例**：
```json
{
  "project": "MySuperApp",
  "version": "1.0.0",
  "last_updated": "2023-10-27 10:00:00",
  "ralph_instruction": "当前上下文已重置。请检查 active_task_id 并从那里继续。",
  "tasks": [
    {
      "id": "T-1",
      "title": "设计用户鉴权系统",
      "status": "completed",
      "nanospec_file": "specs/auth.nano"
    },
    {
      "id": "T-2",
      "title": "实现登录接口",
      "status": "in_progress",
      "nanospec_file": "specs/login.nano",
      "phase": "execute",
      "progress_note": "Plan 已生成，测试用例写了一半，上次中断在 test_login_fail.ts"
    },
    {
      "id": "T-3",
      "title": "前端登录页",
      "status": "pending"
    }
  ]
}
```

**影响范围**：
- 替换原方案中的 `goals.md + ralph-state.json + progress.txt`
- 需要更新 1-spec.md 中的目录结构设计
- 需要新增 Ralph-Aware AI 系统提示设计

---

## [对齐] Ralph-Aware AI 系统提示设计 `@2026-02-11`

**用户确认的方案**：
- 给 AI 注入系统提示，使其感知无状态执行环境
- 支持 checkpoint 机制（每完成一步立即更新 prd.json）
- 支持任务拆分和扩展

**系统提示内容**：
```
Role: 你是 Ralph 自动化流水线中的 Worker。

Environment: 你的上下文内存是有限的，外部脚本（Ralph）会在你运行一段时间后强制杀死你（Kill）。

Primary Rule: Stateless Execution (无状态执行)。

Workflow:
1. 启动 (On Boot): 立即读取根目录下的 prd.json。
2. 定位 (Locate): 找到状态为 in_progress 的任务。
3. 如果没有 nanospec_file，创建它 (nanospec new)，并立即更新 prd.json。
4. 执行 (Execute): 根据 nanospec 的标准流程 (Spec -> Plan -> Code) 工作。
5. 同步 (Sync): 每当你完成一个原子操作（如写完一个 Spec，或通过一个 Test），必须更新 prd.json 中的 progress_note 和 phase。这是你的"存档点"。
6. 扩展 (Expand): 如果你发现当前任务需要拆分，请直接修改 prd.json，将任务拆分或添加新任务。
```

**影响范围**：
- 需要在 1-spec.md 中新增 "AI 系统提示" 章节
- 需要在 2-plan 中实现系统提示注入机制

---

## [对齐] 外层控制器实现方案 `@2026-02-11`

**用户确认的方案**：
- 使用 `ralph_runner.py` 脚本作为外层控制器
- 循环逻辑：读取 PRD → 构造启动 Prompt → 启动 AI → 监控 → 杀掉 → 循环
- 支持基于时间的 Kill 策略（如 10 分钟后必杀）

**脚本逻辑**：
```python
def main():
    while True:
        # 1. 读取状态
        with open('prd.json', 'r') as f:
            prd = json.load(f)

        task = get_active_task(prd)
        if not task:
            print("所有任务已完成！")
            break

        # 2. 构造上下文注入
        boot_message = f"""
        [SYSTEM ALERT: RALPH REBOOT]
        上一次会话已结束。现在是新的会话。
        任务ID: {task['id']}
        标题: {task['title']}
        当前阶段: {task['phase']}
        上次进度: {task['progress_note']}
        关联文件: {task['nanospec_file']}
        """

        # 3. 启动 AI
        process = subprocess.Popen(["iflow", "--prompt", boot_message])

        # 4. 监控循环
        while process.poll() is None:
            time.sleep(5)
            if time.time() - start_time > 600:
                process.terminate()
                break
```

**影响范围**：
- 需要在 1-spec.md 中新增 "外层控制器" 章节
- 需要在 2-plan 中设计控制器实现方案
- 需要在 3-tasks 中添加控制器开发任务

---

## [变更] 技术栈决策 - TypeScript 脚本替代 Python + CLI Command `@2026-02-11`

**用户决策**：
- 统一使用 TypeScript，不引入 Python
- 不做成 CLI command，改为独立的 TS 脚本
- 参考 ralph.ps1 实现，确保实现其全部功能

**ralph.ps1 核心功能**：
1. 多 AI 工具支持（amp/claude/iflow）
2. Prompt 文件读取（prompt.md/CLAUDE.md/IFLOW.md）
3. PRD 文件管理（读取 branchName，检测变更）
4. 进度日志（读取/写入 progress.txt）
5. 分支变更归档（检测分支变化，复制到 archive/）
6. 分支跟踪（记录 .last-branch 文件）
7. 循环控制（最大迭代次数，检测 `<promise>COMPLETE</promise>`）
8. AI 工具调用（管道调用，捕获输出）
9. UTF-8 编码（统一设置 UTF-8）

**TypeScript 实现可行性**：
- ✅ 完全可行，所有功能在 Node.js 中都有对应实现
- ✅ 更统一，与 nanospec 整体技术栈一致
- ✅ 跨平台兼容性更好
- ✅ 类型安全，减少运行时错误

**技术映射**：
| ralph.ps1 | TypeScript | Node.js API |
|-----------|------------|-------------|
| Get-Content | fs.readFile | ✅ |
| ConvertFrom-Json | JSON.parse | ✅ |
| Out-File | fs.appendFile | ✅ |
| Copy-Item | fs.copyFileSync | ✅ |
| 管道调用 | child_process.exec | ✅ |
| UTF-8 编码 | Node.js 默认 | ✅（更简单） |

**影响范围**：
- 1-spec.md 需要更新：移除 CLI command 章节，改为 TS 脚本章节
- 2-plan 需要更新：基于 ralph.ps1 设计 TS 脚本实现方案
- 3-tasks 需要更新：移除 CLI command 开发任务，改为 TS 脚本开发任务
- 新增脚本文件：`scripts/ralph.ts`

---

## [简化] Ralph 功能简化 - 移除归档、仅支持 iflow `@2026-02-11`

**用户决策**：
1. **不需要归档机制** - 移除分支变更归档、分支跟踪、archive/ 目录
2. **一期仅支持 iflow** - 移除 amp/claude 多工具支持
3. **Ralph 只是脚本** - 不需要管理 current、new 等任务创建逻辑
4. **任务创建由内层 AI 负责** - Ralph 只负责启动 AI、监控、Kill、重启

**简化后的 Ralph 核心功能**：
1. 读取 prd.json（可选，用于显示状态）
2. 循环调用 iflow
3. 检测 `<promise>COMPLETE</promise>` 标志
4. 到达最大迭代次数后退出
5. 进度日志（可选）

**简化后的脚本逻辑**：
```typescript
async function main() {
  const maxIterations = 50;

  for (let i = 1; i <= maxIterations; i++) {
    console.log(`Iteration ${i} of ${maxIterations}`);

    try {
      const output = await execPromise('iflow -y');

      if (output.includes('<promise>COMPLETE</promise>')) {
        console.log('Ralph completed all tasks!');
        process.exit(0);
      }
    } catch (error) {
      console.error('Error:', error);
    }

    await sleep(2000);
  }
}
```

**影响范围**：
- 1-spec.md 需要大幅简化：移除归档、多工具、分支管理等章节
- 3-tasks 需要简化：移除归档、多工具、分支跟踪等任务
- 目录结构简化：移除 archive/、.last-branch 等文件

---

## [变更] Ralph 循环策略 - 时间限制替代标志检测 `@2026-02-11`

**问题**：
- 检测 `<promise>COMPLETE</promise>` 标志不靠谱，读取可能不准确
- AI 输出格式变化或解析错误导致检测失败

**用户决策**：
- 移除标志检测机制
- 改用时间限制策略：5 分钟 kill 一次
- Ralph 持续循环，直到用户手动停止（Ctrl+C）

**更新后的脚本逻辑**：
```typescript
import { spawn } from 'child_process';

async function main() {
  const TIME_LIMIT = 5 * 60 * 1000; // 5 分钟
  const SLEEP_BETWEEN = 2000; // 2 秒

  while (true) {
    console.log('Starting iflow session...');

    const startTime = Date.now();
    const iflowProcess = spawn('iflow', ['-y']);

    // 监控 iflow 输出
    iflowProcess.stdout.on('data', (data) => {
      console.log(data.toString());
    });

    iflowProcess.stderr.on('data', (data) => {
      console.error(data.toString());
    });

    // 超时终止
    setTimeout(() => {
      if (!iflowProcess.killed) {
        console.log('Time limit reached, killing iflow...');
        iflowProcess.kill();
      }
    }, TIME_LIMIT);

    // 等待进程结束
    await new Promise<void>((resolve) => {
      iflowProcess.on('close', resolve);
    });

    console.log('Session ended. Sleeping before next session...');
    await sleep(SLEEP_BETWEEN);
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

main();
```

**影响范围**：
- 1-spec.md 工作流程需要更新
- 3-tasks 需要更新脚本实现任务

---

## [x] [歧义] Slash Command 位置明确化 `@2026-02-11`

**问题**：注入的 prompt 中必须明确指明 slash command 在哪里，因为 AI 是不知道 spec plan 对应的指令的。

**用户决策**：
- 在 1-spec.md 中明确指出使用 iflow 工具的 slash commands
- Slash commands 位于 `.iflow/commands/` 目录下：
  - `.iflow/commands/spec.1-spec.toml` - 规格撰写
  - `.iflow/commands/spec.2-plan.toml` - 方案设计
  - `.iflow/commands/spec.3-execute.toml` - 执行交付
- 在内层 AI 的职责说明中，明确指定使用这些 slash command

**影响范围**：
- 1-spec.md 需要更新"内层 AI 的职责"部分
- 需要明确 slash command 的完整路径

**Resolved:** 已更新 1-spec.md，明确指出 slash commands 的位置和完整路径。 `@2026-02-11`

---

## [x] [变更] 测试验证要求 - 集成测试必须在子文件夹中完成 `@2026-02-11`

**问题**：当前 3-tasks.md 中的集成测试任务不够明确，需要定义具体的测试场景。

**用户决策**：
- 任务完成后，必须在一个子文件夹中进行测试
- 成功地跑一个 ralph + nano-spec 流程，才算成功
- 测试应该包含完整的流程：创建任务 → 执行 Ralph 脚本 → 验证结果

**测试要求**：
1. 创建一个测试子文件夹（如 `test-ralph/`）
2. 在测试子文件夹中初始化 nanospec
3. 创建一个简单的测试任务
4. 运行 ralph.ts 脚本
5. 验证任务是否按预期完成

**影响范围**：
- 3-tasks.md 需要新增集成测试任务
- 需要明确测试步骤和验收标准

**Resolved:** 已在 3-tasks.md 中新增 Phase 8 测试验证任务，明确了测试步骤和验收标准。 `@2026-02-11`

---

## [x] [变更] 移除斜杠命令 - Ralph 仅作为脚本运行 `@2026-02-11`

**问题**：原计划需要新增 Ralph 相关的斜杠命令（spec.ralph-status、spec.ralph-add、spec.ralph-sync、spec.ralph-complete）。

**用户决策**：
- 不需要新增斜杠命令
- Ralph 仅作为独立脚本运行
- 内层 AI 直接使用现有的 nanospec 命令（new、switch 等）

**影响范围**：
- 2-plan.md 需要移除"斜杠命令实现"章节
- 3-tasks.md 需要移除 Phase 3 斜杠命令任务
- 已创建的 .iflow/commands/spec.ralph-*.toml 文件需要删除

**Resolved:** 已删除斜杠命令相关内容，Ralph 简化为独立脚本。 `@2026-02-11`