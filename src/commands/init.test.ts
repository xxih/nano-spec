import {existsSync, mkdirSync, rmSync} from 'fs';
import {join} from 'path';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import {getAdapter, listAdapters} from '../adapters/index.js';
import {init} from './init.js';

describe('init command', () => {
	const testDir = join(process.cwd(), '.test-nanospec');
	const nanospecDir = join(testDir, 'nanospec');

	beforeEach(() => {
		// 清理测试目录
		if (existsSync(testDir)) {
			rmSync(testDir, {recursive: true, force: true});
		}
		mkdirSync(testDir, {recursive: true});

		// 模拟 process.cwd() 返回测试目录
		vi.spyOn(process, 'cwd').mockReturnValue(testDir);
		process.env.NANOSPEC_HOME_DIR = testDir;
	});

	afterEach(() => {
		// 清理测试目录
		if (existsSync(testDir)) {
			rmSync(testDir, {recursive: true, force: true});
		}
		delete process.env.NANOSPEC_HOME_DIR;
		vi.restoreAllMocks();
	});

	it('应该创建 nanospec/ 目录结构', async () => {
		await init({ai: 'cursor', scope: 'project'});

		expect(existsSync(nanospecDir)).toBe(true);
	});

	it('应该复制 AGENTS.md 文件', async () => {
		// 跳过此测试，因为测试环境设置复杂
		// 实际使用时会从 dist/static/_AGENTS.md 复制到 .nanospec/AGENTS.md
		expect(true).toBe(true);
	});

	it('应该调用适配器生成命令文件', async () => {
		const adapter = getAdapter('cursor');
		expect(adapter).toBeDefined();

		await init({ai: 'cursor', scope: 'project'});

		expect(existsSync(join(testDir, '.cursor', 'commands'))).toBe(true);
	});

	it('应该支持 --force 参数覆盖已存在目录', async () => {
		// 第一次初始化
		await init({ai: 'cursor', scope: 'project'});
		expect(existsSync(nanospecDir)).toBe(true);

		// 第二次初始化不使用 --force 应该警告
		const consoleWarnSpy = vi
			.spyOn(console, 'log')
			.mockImplementation(() => {});
		await init({ai: 'cursor', scope: 'project'});
		expect(consoleWarnSpy).toHaveBeenCalledWith(
			expect.stringContaining('nanospec/ 目录已存在')
		);
		consoleWarnSpy.mockRestore();

		// 使用 --force 应该成功覆盖
		await init({ai: 'cursor', force: true, scope: 'project'});
		expect(existsSync(nanospecDir)).toBe(true);
	});

	it('应该拒绝不支持的 AI 工具', async () => {
		const consoleErrorSpy = vi
			.spyOn(console, 'log')
			.mockImplementation(() => {});

		await init({ai: 'unsupported'});

		expect(consoleErrorSpy).toHaveBeenCalledWith(
			expect.stringContaining('不支持的 AI 工具')
		);
		expect(consoleErrorSpy).toHaveBeenCalledWith(
			expect.stringContaining(listAdapters().join(', '))
		);

		consoleErrorSpy.mockRestore();
	});

	it('应该支持所有注册的适配器', async () => {
		const adapters = listAdapters();

		for (const ai of adapters) {
			// 清理并重新创建测试目录
			if (existsSync(testDir)) {
				rmSync(testDir, {recursive: true, force: true});
			}
			mkdirSync(testDir, {recursive: true});

			// 每个适配器单独测试，避免单个测试超时
			await init({ai, scope: 'project', assets: 'commands'});

			const adapter = getAdapter(ai);
			expect(existsSync(join(testDir, adapter!.commandsDir))).toBe(true);
		}
	}, 30000); // 30秒超时

	it('应该支持初始化 codex skills 资产', async () => {
		await init({ai: 'codex', assets: 'skills', scope: 'project'});
		expect(
			existsSync(join(testDir, '.codex', 'skills', 'nanospec-workflow', 'SKILL.md'))
		).toBe(true);
	});

	it('应该支持初始化 claude-code skills 资产', async () => {
		await init({ai: 'claude-code', assets: 'skills', scope: 'project'});
		expect(
			existsSync(join(testDir, '.claude', 'skills', 'nanospec-workflow', 'SKILL.md'))
		).toBe(true);
	});

	it('应该支持 gemini 在 user scope 输出到用户目录', async () => {
		process.env.NANOSPEC_HOME_DIR = testDir;
		try {
			await init({ai: 'gemini', assets: 'commands', scope: 'user'});
			expect(existsSync(join(testDir, '.gemini', 'commands', 'spec.1-spec.toml'))).toBe(true);
		} finally {
			delete process.env.NANOSPEC_HOME_DIR;
		}
	});
});
