import {existsSync, mkdirSync, rmSync, writeFileSync} from 'fs';
import {join} from 'path';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import {showStatus} from './status.js';

describe('status command', () => {
	const testDir = join(process.cwd(), '.test-nanospec-status');
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

		await showStatus();

		expect(consoleLogSpy).toHaveBeenCalledWith(
			expect.stringContaining('请先运行 nanospec init')
		);

		consoleLogSpy.mockRestore();
	});

	it('应该显示配置信息', async () => {
		mkdirSync(nanospecDir, {recursive: true});

		const consoleLogSpy = vi
			.spyOn(console, 'log')
			.mockImplementation(() => {});

		await showStatus();

		expect(consoleLogSpy).toHaveBeenCalledWith(
			expect.stringContaining('nanospec 配置')
		);

		consoleLogSpy.mockRestore();
	});

	it('应该显示当前任务（未设置）', async () => {
		mkdirSync(nanospecDir, {recursive: true});

		const consoleLogSpy = vi
			.spyOn(console, 'log')
			.mockImplementation(() => {});

		await showStatus();

		expect(consoleLogSpy).toHaveBeenCalledWith(
			expect.stringContaining('当前任务: 未设置')
		);

		consoleLogSpy.mockRestore();
	});

	it('应该显示当前任务（已设置）', async () => {
		mkdirSync(nanospecDir, {recursive: true});
		mkdirSync(nanospecConfigDir, {recursive: true});

		// 设置当前任务
		writeFileSync(join(nanospecConfigDir, 'current-task'), 'test-task', 'utf-8');

		// 创建任务目录
		const taskDir = join(nanospecDir, 'test-task');
		mkdirSync(taskDir, {recursive: true});
		mkdirSync(join(taskDir, 'outputs'), {recursive: true});

		const consoleLogSpy = vi
			.spyOn(console, 'log')
			.mockImplementation(() => {});

		await showStatus();

		expect(consoleLogSpy).toHaveBeenCalledWith(
			expect.stringContaining('test-task')
		);

		consoleLogSpy.mockRestore();
	});

	it('应该显示任务进度', async () => {
		mkdirSync(nanospecDir, {recursive: true});
		mkdirSync(nanospecConfigDir, {recursive: true});

		// 设置当前任务
		writeFileSync(join(nanospecConfigDir, 'current-task'), 'test-task', 'utf-8');

		// 创建任务目录和文件
		const taskDir = join(nanospecDir, 'test-task');
		mkdirSync(taskDir, {recursive: true});
		mkdirSync(join(taskDir, 'outputs'), {recursive: true});
		writeFileSync(join(taskDir, 'brief.md'), '# Test Task', 'utf-8');

		const consoleLogSpy = vi
			.spyOn(console, 'log')
			.mockImplementation(() => {});

		await showStatus();

		expect(consoleLogSpy).toHaveBeenCalledWith(
			expect.stringContaining('任务进度')
		);

		consoleLogSpy.mockRestore();
	});

	it('应该显示所有任务列表', async () => {
		mkdirSync(nanospecDir, {recursive: true});

		// 创建多个任务
		const task1Dir = join(nanospecDir, 'task1');
		mkdirSync(task1Dir, {recursive: true});
		writeFileSync(join(task1Dir, 'brief.md'), '# Task 1', 'utf-8');

		const task2Dir = join(nanospecDir, 'task2');
		mkdirSync(task2Dir, {recursive: true});
		writeFileSync(join(task2Dir, 'brief.md'), '# Task 2', 'utf-8');

		const consoleLogSpy = vi
			.spyOn(console, 'log')
			.mockImplementation(() => {});

		await showStatus();

		expect(consoleLogSpy).toHaveBeenCalledWith(
			expect.stringContaining('所有任务')
		);

		consoleLogSpy.mockRestore();
	});

	it('应该在无任务时显示提示', async () => {
		mkdirSync(nanospecDir, {recursive: true});

		const consoleLogSpy = vi
			.spyOn(console, 'log')
			.mockImplementation(() => {});

		await showStatus();

		expect(consoleLogSpy).toHaveBeenCalledWith(
			expect.stringContaining('暂无任务')
		);

		consoleLogSpy.mockRestore();
	});
});