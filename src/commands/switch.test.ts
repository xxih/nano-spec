import {existsSync, mkdirSync, rmSync, writeFileSync} from 'fs';
import {join} from 'path';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import {switchTask} from './switch.js';

describe('switch command', () => {
	const testDir = join(process.cwd(), '.test-nanospec-switch');
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

	it('应该在未初始化时显示错误', async () => {
		const consoleLogSpy = vi
			.spyOn(console, 'log')
			.mockImplementation(() => {});

		await switchTask('test-task');

		expect(consoleLogSpy).toHaveBeenCalledWith(
			expect.stringContaining('请先运行 nanospec init')
		);

		consoleLogSpy.mockRestore();
	});

	it('应该在任务不存在时显示错误', async () => {
		mkdirSync(nanospecDir, {recursive: true});

		const consoleLogSpy = vi
			.spyOn(console, 'log')
			.mockImplementation(() => {});

		await switchTask('nonexistent-task');

		expect(consoleLogSpy).toHaveBeenCalledWith(
			expect.stringContaining('任务不存在')
		);

		consoleLogSpy.mockRestore();
	});

	it('应该切换到指定任务', async () => {
		mkdirSync(nanospecDir, {recursive: true});
		mkdirSync(nanospecConfigDir, {recursive: true});

		// 创建任务
		const taskDir = join(nanospecDir, 'test-task');
		mkdirSync(taskDir, {recursive: true});
		writeFileSync(join(taskDir, 'brief.md'), '# Test Task', 'utf-8');

		const consoleLogSpy = vi
			.spyOn(console, 'log')
			.mockImplementation(() => {});

		await switchTask('test-task');

		expect(consoleLogSpy).toHaveBeenCalledWith(
			expect.stringContaining('已切换到任务')
		);

		consoleLogSpy.mockRestore();
	});

	it('应该在无任务时显示提示', async () => {
		mkdirSync(nanospecDir, {recursive: true});

		const consoleLogSpy = vi
			.spyOn(console, 'log')
			.mockImplementation(() => {});

		await switchTask();

		expect(consoleLogSpy).toHaveBeenCalledWith(
			expect.stringContaining('暂无任务')
		);

		consoleLogSpy.mockRestore();
	});

	it('应该显示任务状态', async () => {
		mkdirSync(nanospecDir, {recursive: true});
		mkdirSync(nanospecConfigDir, {recursive: true});

		// 创建任务
		const taskDir = join(nanospecDir, 'test-task');
		mkdirSync(taskDir, {recursive: true});
		mkdirSync(join(taskDir, 'outputs'), {recursive: true});
		writeFileSync(join(taskDir, 'brief.md'), '# Test Task', 'utf-8');

		const consoleLogSpy = vi
			.spyOn(console, 'log')
			.mockImplementation(() => {});

		await switchTask('test-task');

		expect(consoleLogSpy).toHaveBeenCalledWith(
			expect.stringContaining('任务状态')
		);

		consoleLogSpy.mockRestore();
	});

	it('应该在任务不存在时显示可用任务列表', async () => {
		mkdirSync(nanospecDir, {recursive: true});

		// 创建一些任务
		const task1Dir = join(nanospecDir, 'task1');
		mkdirSync(task1Dir, {recursive: true});
		writeFileSync(join(task1Dir, 'brief.md'), '# Task 1', 'utf-8');

		const task2Dir = join(nanospecDir, 'task2');
		mkdirSync(task2Dir, {recursive: true});
		writeFileSync(join(task2Dir, 'brief.md'), '# Task 2', 'utf-8');

		const consoleLogSpy = vi
			.spyOn(console, 'log')
			.mockImplementation(() => {});

		await switchTask('nonexistent-task');

		expect(consoleLogSpy).toHaveBeenCalledWith(
			expect.stringContaining('可用任务')
		);

		consoleLogSpy.mockRestore();
	});
});