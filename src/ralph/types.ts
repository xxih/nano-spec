/**
 * Ralph 核心数据类型定义
 */

export type TaskStatus = 'pending' | 'in_progress' | 'completed';

export type TaskPhase = 'spec' | 'plan' | 'execute' | 'review';

/**
 * 单个任务定义
 */
export interface PrdTask {
  /** 任务唯一标识 */
  id: string;
  /** 任务标题 */
  title: string;
  /** 任务状态 */
  status: TaskStatus;
  /** 关联的 nanospec 任务目录路径 */
  nanospec_file?: string;
  /** 当前阶段 */
  phase?: TaskPhase;
  /** 进度备注（用于断点续执行） */
  progress_note?: string;
}

/**
 * prd.json 核心状态对象
 */
export interface PrdJson {
  /** 项目名称 */
  project: string;
  /** 项目版本 */
  version: string;
  /** 最后更新时间 */
  last_updated: string;
  /** AI 重启时的上下文注入信息 */
  ralph_instruction: string;
  /** 任务队列数组 */
  tasks: PrdTask[];
}