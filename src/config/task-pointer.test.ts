import {existsSync, mkdirSync, rmSync, writeFileSync} from 'fs';
import {join} from 'path';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import {
	getCurrentTask,
	setCurrentTask,
	clearCurrentTask,
	listTasks,
	getTaskStatus,
} from './task-pointer.js';

describe('task-pointer module', () => {
	const testDir = join(process.cwd(), '.test-nanospec-task-pointer');
	const nanospecDir = join(testDir, 'nanospec');
	const nanospecConfigDir = join(testDir, '.nanospec');

	beforeEach(() => {
		// 清理测试目录
		if (existsSync(testDir)) {
			rmSync(testDir, {recursive: true, force: true});
		}
		mkdirSync(testDir, {recursive: true});

		// 模拟 process.cwd() 返回测试目录
		vi.spyOn(process, 'cwd').mockReturnValue(testDir);
	});

	afterEach(() => {
		// 清理测试目录
		if (existsSync(testDir)) {
			rmSync(testDir, {recursive: true, force: true});
		}
		vi.restoreAllMocks();
	});

	describe('getCurrentTask', () => {
		it('应该在未设置时返回 null', () => {
			const currentTask = getCurrentTask();
			expect(currentTask).toBeNull();
		});

		it('应该返回当前任务名称', () => {
			mkdirSync(nanospecConfigDir, {recursive: true});
			writeFileSync(join(nanospecConfigDir, 'current-task'), 'test-task', 'utf-8');

			const currentTask = getCurrentTask();
			expect(currentTask).toBe('test-task');
		});

		it('应该处理空文件', () => {
			mkdirSync(nanospecConfigDir, {recursive: true});
			writeFileSync(join(nanospecConfigDir, 'current-task'), '', 'utf-8');

			const currentTask = getCurrentTask();
			expect(currentTask).toBe('');
		});
	});

	describe('setCurrentTask', () => {
		it('应该设置当前任务', () => {
			setCurrentTask(testDir, 'test-task');

			const currentTask = getCurrentTask(testDir);
			expect(currentTask).toBe('test-task');
		});

		it('应该创建 .nanospec 目录（如果不存在）', () => {
			expect(existsSync(nanospecConfigDir)).toBe(false);

			setCurrentTask(testDir, 'test-task');

			expect(existsSync(nanospecConfigDir)).toBe(true);
		});

		it('应该覆盖现有任务', () => {
			setCurrentTask(testDir, 'task1');
			expect(getCurrentTask(testDir)).toBe('task1');

			setCurrentTask(testDir, 'task2');
			expect(getCurrentTask(testDir)).toBe('task2');
		});
	});

	describe('clearCurrentTask', () => {
		it('应该清除当前任务', () => {
			setCurrentTask(testDir, 'test-task');
			expect(getCurrentTask(testDir)).toBe('test-task');

			clearCurrentTask(testDir);
			expect(getCurrentTask(testDir)).toBeNull();
		});

		it('应该在未设置时安全执行', () => {
			expect(getCurrentTask(testDir)).toBeNull();

			expect(() => clearCurrentTask(testDir)).not.toThrow();
		});
	});

	describe('listTasks', () => {
		it('应该在未初始化时返回空数组', async () => {
			const tasks = await listTasks();
			expect(tasks).toEqual([]);
		});

		it('应该列出所有任务', async () => {
			mkdirSync(nanospecDir, {recursive: true});

			// 创建多个任务
			mkdirSync(join(nanospecDir, 'task1'), {recursive: true});
			mkdirSync(join(nanospecDir, 'task2'), {recursive: true});
			mkdirSync(join(nanospecDir, 'task3'), {recursive: true});

			const tasks = await listTasks();
			expect(tasks).toHaveLength(3);
			expect(tasks).toContain('task1');
			expect(tasks).toContain('task2');
			expect(tasks).toContain('task3');
		});

		it('应该按名称排序', async () => {
			mkdirSync(nanospecDir, {recursive: true});

			// 创建多个任务（无序）
			mkdirSync(join(nanospecDir, 'task3'), {recursive: true});
			mkdirSync(join(nanospecDir, 'task1'), {recursive: true});
			mkdirSync(join(nanospecDir, 'task2'), {recursive: true});

			const tasks = await listTasks();
			expect(tasks).toEqual(['task1', 'task2', 'task3']);
		});
	});

	describe('getTaskStatus', () => {
		it('应该在任务不存在时返回 false 状态', async () => {
			const status = await getTaskStatus(testDir, 'nonexistent-task');

			expect(status.exists).toBe(false);
			expect(status.hasBrief).toBe(false);
			expect(status.hasSpec).toBe(false);
			expect(status.hasPlan).toBe(false);
			expect(status.hasTasks).toBe(false);
		});

		it('应该检查任务存在性', async () => {
			mkdirSync(nanospecDir, {recursive: true});
			mkdirSync(join(nanospecDir, 'test-task'), {recursive: true});

			const status = await getTaskStatus(testDir, 'test-task');

			expect(status.exists).toBe(true);
		});

		it('应该检查 brief.md', async () => {
			mkdirSync(nanospecDir, {recursive: true});
			const taskDir = join(nanospecDir, 'test-task');
			mkdirSync(taskDir, {recursive: true});
			writeFileSync(join(taskDir, 'brief.md'), '# Test Task', 'utf-8');

			const status = await getTaskStatus(testDir, 'test-task');

			expect(status.hasBrief).toBe(true);
		});

		it('应该检查 1-spec.md', async () => {
			mkdirSync(nanospecDir, {recursive: true});
			const taskDir = join(nanospecDir, 'test-task');
			mkdirSync(taskDir, {recursive: true});
			mkdirSync(join(taskDir, 'outputs'), {recursive: true});
			writeFileSync(join(taskDir, 'outputs', '1-spec.md'), '# Spec', 'utf-8');

			const status = await getTaskStatus(testDir, 'test-task');

			expect(status.hasSpec).toBe(true);
		});

		it('应该检查 2-plan.md', async () => {
			mkdirSync(nanospecDir, {recursive: true});
			const taskDir = join(nanospecDir, 'test-task');
			mkdirSync(taskDir, {recursive: true});
			mkdirSync(join(taskDir, 'outputs'), {recursive: true});
			writeFileSync(join(taskDir, 'outputs', '2-plan.md'), '# Plan', 'utf-8');

			const status = await getTaskStatus(testDir, 'test-task');

			expect(status.hasPlan).toBe(true);
		});

		it('应该检查 3-tasks.md', async () => {
			mkdirSync(nanospecDir, {recursive: true});
			const taskDir = join(nanospecDir, 'test-task');
			mkdirSync(taskDir, {recursive: true});
			mkdirSync(join(taskDir, 'outputs'), {recursive: true});
			writeFileSync(join(taskDir, 'outputs', '3-tasks.md'), '# Tasks', 'utf-8');

			const status = await getTaskStatus(testDir, 'test-task');

			expect(status.hasTasks).toBe(true);
		});

		it('应该返回完整的任务状态', async () => {
			mkdirSync(nanospecDir, {recursive: true});
			const taskDir = join(nanospecDir, 'test-task');
			mkdirSync(taskDir, {recursive: true});
			mkdirSync(join(taskDir, 'outputs'), {recursive: true});
			writeFileSync(join(taskDir, 'brief.md'), '# Brief', 'utf-8');
			writeFileSync(join(taskDir, 'outputs', '1-spec.md'), '# Spec', 'utf-8');
			writeFileSync(join(taskDir, 'outputs', '2-plan.md'), '# Plan', 'utf-8');
			writeFileSync(join(taskDir, 'outputs', '3-tasks.md'), '# Tasks', 'utf-8');

			const status = await getTaskStatus(testDir, 'test-task');

			expect(status.exists).toBe(true);
			expect(status.hasBrief).toBe(true);
			expect(status.hasSpec).toBe(true);
			expect(status.hasPlan).toBe(true);
			expect(status.hasTasks).toBe(true);
		});
	});
});