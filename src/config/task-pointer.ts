import { existsSync, readFileSync, writeFileSync, mkdirSync, readdirSync } from 'fs';
import { join } from 'path';
import { loadConfig } from './config.js';

const NANOSPEC_DIR = '.nanospec';
const CURRENT_TASK_FILE = 'current-task';

/**
 * 获取当前任务指针
 * @param cwd 工作目录
 * @returns 当前任务名称，如果未设置则返回 null
 */
export function getCurrentTask(cwd: string = process.cwd()): string | null {
	const taskPointerPath = join(cwd, NANOSPEC_DIR, CURRENT_TASK_FILE);

	if (!existsSync(taskPointerPath)) {
		return null;
	}

	try {
		const content = readFileSync(taskPointerPath, 'utf-8');
		return content.trim();
	} catch (error) {
		console.warn(`⚠️  无法读取任务指针: ${taskPointerPath}`);
		return null;
	}
}

/**
 * 设置当前任务指针
 * @param cwd 工作目录
 * @param taskName 任务名称
 */
export function setCurrentTask(cwd: string = process.cwd(), taskName: string): void {
	const nanospecDir = join(cwd, NANOSPEC_DIR);

	// 确保 .nanospec 目录存在
	if (!existsSync(nanospecDir)) {
		mkdirSync(nanospecDir, { recursive: true });
	}

	const taskPointerPath = join(nanospecDir, CURRENT_TASK_FILE);

	try {
		writeFileSync(taskPointerPath, taskName, 'utf-8');
	} catch (error) {
		console.error(`❌ 无法写入任务指针: ${taskPointerPath}`);
		throw error;
	}
}

/**
 * 清除当前任务指针
 * @param cwd 工作目录
 */
export function clearCurrentTask(cwd: string = process.cwd()): void {
	const taskPointerPath = join(cwd, NANOSPEC_DIR, CURRENT_TASK_FILE);

	if (existsSync(taskPointerPath)) {
		try {
			// 删除文件
			const { unlinkSync } = require('fs');
			unlinkSync(taskPointerPath);
		} catch (error) {
			console.warn(`⚠️  无法删除任务指针: ${taskPointerPath}`);
		}
	}
}

/**
 * 获取所有任务列表
 * @param cwd 工作目录
 * @returns 任务名称列表
 */
export async function listTasks(cwd: string = process.cwd()): Promise<string[]> {
	const config = await loadConfig(cwd);
	const nanospecDir = join(cwd, config.specs_root || 'nanospec');

	if (!existsSync(nanospecDir)) {
		return [];
	}

	try {
		const entries = readdirSync(nanospecDir, { withFileTypes: true });
		return entries
			.filter(entry => entry.isDirectory())
			.map(entry => entry.name)
			.sort();
	} catch (error) {
		console.warn(`⚠️  无法读取任务目录: ${nanospecDir}`);
		return [];
	}
}

/**
 * 获取任务状态
 * @param cwd 工作目录
 * @param taskName 任务名称
 * @returns 任务状态信息
 */
export async function getTaskStatus(cwd: string = process.cwd(), taskName: string): Promise<{
	exists: boolean;
	hasBrief: boolean;
	hasSpec: boolean;
	hasPlan: boolean;
	hasTasks: boolean;
}> {
	const config = await loadConfig(cwd);
	const taskDir = join(cwd, config.specs_root || 'nanospec', taskName);

	if (!existsSync(taskDir)) {
		return {
			exists: false,
			hasBrief: false,
			hasSpec: false,
			hasPlan: false,
			hasTasks: false,
		};
	}

	const outputsDir = join(taskDir, 'outputs');

	return {
		exists: true,
		hasBrief: existsSync(join(taskDir, 'brief.md')),
		hasSpec: existsSync(join(outputsDir, '1-spec.md')),
		hasPlan: existsSync(join(outputsDir, '2-plan.md')),
		hasTasks: existsSync(join(outputsDir, '3-tasks.md')),
	};
}