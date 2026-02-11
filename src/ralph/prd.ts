/**
 * prd.json 读写工具函数
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import type { PrdJson, PrdTask, TaskStatus } from './types.js';

/**
 * 读取 prd.json 文件
 */
export async function readPrd(prdPath: string): Promise<PrdJson> {
  const content = await fs.readFile(prdPath, 'utf-8');
  return JSON.parse(content) as PrdJson;
}

/**
 * 写入 prd.json 文件
 */
export async function writePrd(prdPath: string, prd: PrdJson): Promise<void> {
  prd.last_updated = new Date().toISOString();
  await fs.writeFile(prdPath, JSON.stringify(prd, null, 2), 'utf-8');
}

/**
 * 获取当前进行中的任务
 */
export function getActiveTask(prd: PrdJson): PrdTask | undefined {
  return prd.tasks.find(t => t.status === 'in_progress');
}

/**
 * 获取下一个待处理的任务
 */
export function getPendingTask(prd: PrdJson): PrdTask | undefined {
  return prd.tasks.find(t => t.status === 'pending');
}

/**
 * 根据任务 ID 查找任务
 */
export function getTaskById(prd: PrdJson, taskId: string): PrdTask | undefined {
  return prd.tasks.find(t => t.id === taskId);
}

/**
 * 添加新任务
 */
export function addTask(prd: PrdJson, task: PrdTask): void {
  prd.tasks.push(task);
}

/**
 * 更新任务状态
 */
export function updateTaskStatus(prd: PrdJson, taskId: string, status: TaskStatus): boolean {
  const task = getTaskById(prd, taskId);
  if (task) {
    task.status = status;
    return true;
  }
  return false;
}

/**
 * 更新任务阶段和进度备注
 */
export function updateTaskProgress(
  prd: PrdJson,
  taskId: string,
  phase: string,
  progressNote: string
): boolean {
  const task = getTaskById(prd, taskId);
  if (task) {
    task.phase = phase as any;
    task.progress_note = progressNote;
    return true;
  }
  return false;
}