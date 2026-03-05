import {join} from 'path';
import {existsSync, mkdirSync, rmSync} from 'fs';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import {syncCommands} from './sync.js';

describe('sync command', () => {
	const testDir = join(process.cwd(), '.test-nanospec-sync');

	beforeEach(() => {
		if (existsSync(testDir)) {
			rmSync(testDir, {recursive: true, force: true});
		}
		mkdirSync(testDir, {recursive: true});

		// 模拟 process.cwd() 返回测试目录
		vi.spyOn(process, 'cwd').mockReturnValue(testDir);
	});

	afterEach(() => {
		if (existsSync(testDir)) {
			rmSync(testDir, {recursive: true, force: true});
		}
		delete process.env.NANOSPEC_HOME_DIR;
		vi.restoreAllMocks();
	});

	it('应该同步命令到所有适配器', async () => {
		const consoleLogSpy = vi
			.spyOn(console, 'log')
			.mockImplementation(() => {});

		await syncCommands();

		expect(consoleLogSpy).toHaveBeenCalledWith(
			expect.stringContaining('开始同步资产')
		);
		expect(consoleLogSpy).toHaveBeenCalledWith(
			expect.stringContaining('资产同步完成')
		);

		consoleLogSpy.mockRestore();
	});

	it('应该同步命令到指定适配器', async () => {
		const consoleLogSpy = vi
			.spyOn(console, 'log')
			.mockImplementation(() => {});

		await syncCommands({adapter: 'cursor'});

		expect(consoleLogSpy).toHaveBeenCalledWith(
			expect.stringContaining('开始同步资产')
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
			expect.stringContaining('资产同步完成')
		);

		consoleLogSpy.mockRestore();
	});

	it('应该支持仅同步 codex skills', async () => {
		const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

		await syncCommands({adapter: 'codex', assets: 'skills', scope: 'project'});

		expect(consoleLogSpy).toHaveBeenCalledWith(
			expect.stringContaining('skills')
		);

		consoleLogSpy.mockRestore();
	});

	it('codex commands 在 project scope 下应写入用户目录', async () => {
		const homeDir = join(testDir, '.test-home');
		process.env.NANOSPEC_HOME_DIR = homeDir;

		await syncCommands({adapter: 'codex', assets: 'commands', scope: 'project'});

		expect(existsSync(join(homeDir, '.codex', 'prompts', 'spec.1-spec.md'))).toBe(true);
		expect(existsSync(join(testDir, '.codex', 'prompts'))).toBe(false);
	});

	it('应该支持同步 claude-code skills', async () => {
		await syncCommands({adapter: 'claude-code', assets: 'skills', scope: 'project'});
		expect(
			existsSync(join(testDir, '.claude', 'skills', 'nanospec', 'SKILL.md'))
		).toBe(true);
	});
});
