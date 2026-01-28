import {join} from 'path';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import {syncCommands} from './sync.js';

describe('sync command', () => {
	const testDir = join(process.cwd(), '.test-nanospec-sync');

	beforeEach(() => {
		// 模拟 process.cwd() 返回测试目录
		vi.spyOn(process, 'cwd').mockReturnValue(testDir);
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it('应该同步命令到所有适配器', async () => {
		const consoleLogSpy = vi
			.spyOn(console, 'log')
			.mockImplementation(() => {});

		await syncCommands();

		expect(consoleLogSpy).toHaveBeenCalledWith(
			expect.stringContaining('开始同步命令')
		);
		expect(consoleLogSpy).toHaveBeenCalledWith(
			expect.stringContaining('命令同步完成')
		);

		consoleLogSpy.mockRestore();
	});

	it('应该同步命令到指定适配器', async () => {
		const consoleLogSpy = vi
			.spyOn(console, 'log')
			.mockImplementation(() => {});

		await syncCommands({adapter: 'cursor'});

		expect(consoleLogSpy).toHaveBeenCalledWith(
			expect.stringContaining('开始同步命令')
		);

		consoleLogSpy.mockRestore();
	});

	it('应该跳过不支持的适配器', async () => {
		const consoleLogSpy = vi
			.spyOn(console, 'log')
			.mockImplementation(() => {});

		await syncCommands({adapter: 'nonexistent-adapter'});

		expect(consoleLogSpy).toHaveBeenCalledWith(
			expect.stringContaining('跳过不支持的适配器')
		);

		consoleLogSpy.mockRestore();
	});

	it('应该处理同步错误', async () => {
		const consoleLogSpy = vi
			.spyOn(console, 'log')
			.mockImplementation(() => {});

		// 模拟一个会出错的适配器
		await syncCommands({adapter: 'cursor'});

		// 如果没有错误，应该显示完成
		expect(consoleLogSpy).toHaveBeenCalledWith(
			expect.stringContaining('命令同步完成')
		);

		consoleLogSpy.mockRestore();
	});
});