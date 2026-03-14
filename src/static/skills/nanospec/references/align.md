# 对齐

## 目标

在出现偏差、变更、缺失或歧义时，记录到 `alignment.md`，同步 outputs，并把后续动作落到 `outputs/3-tasks.md`。

## 输入

1. `alignment.md`（若存在）。
2. `brief.md` / `prd.md`。
3. `assets/*`。
4. `outputs/1-spec.md`、`outputs/2-plan.md`、`outputs/3-tasks.md`。
5. `outputs/acceptance.md`（若存在）。
6. 工作区现状。

## 执行流程

1. 一旦出现需求变化、实现偏差或临时决策，先暂停当前阶段，立即进入 align。
2. 将新的对齐记录追加到 `alignment.md`。
3. 为每条问题标注 `[偏差] [变更] [缺失] [歧义] [冲突]`，需要用户确认时加 `` `⏳ 待确认` ``。
4. 立即同步更新所有受影响 outputs。
5. 将后续修正动作补进 `outputs/3-tasks.md`。
6. 已解决项要补充明确说明和日期。
7. 如果当前工作由其他 plan / research / execute skill 推进，也继续沿用同一任务目录，不另起草稿。

## 输出约束

- `alignment.md` 使用统一标签格式。
- 受影响 outputs 必须同步更新，不能只留日志。
- 对齐产生的新动作必须转成可追踪任务。

## 规则

- align 不是可选补记；在 spec、plan、execute 继续推进前，必须先完成本轮对齐回写。
- align 也是跨 skill 的纠偏入口；并不要求先跑完整 NanoSpec workflow。
- 保持 `alignment.md` 与各输出文件内容一致，不留冲突状态。
- 未解决的确认项统一标记为 `⏳ 待确认`。
