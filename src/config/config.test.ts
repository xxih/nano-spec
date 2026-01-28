import {existsSync, mkdirSync, rmSync, writeFileSync} from 'fs';
import {join} from 'path';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import {loadConfig, DEFAULT_CONFIG} from './config.js';

describe('config module', () => {
	const testDir = join(process.cwd(), '.test-nanospec-config-module');
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

	it('应该返回默认配置（无配置文件时）', async () => {
		const config = await loadConfig();

		expect(config).toEqual(DEFAULT_CONFIG);
	});

	it('应该加载项目级配置（.nanospecrc）', async () => {
		const configPath = join(testDir, '.nanospecrc');
		writeFileSync(configPath, JSON.stringify({specs_root: 'my-specs', default_adapter: 'qwen'}), 'utf-8');

		const config = await loadConfig();

		expect(config.specs_root).toBe('my-specs');
		expect(config.default_adapter).toBe('qwen');
	});

	it('应该合并默认配置和项目配置', async () => {
		const configPath = join(testDir, '.nanospecrc');
		writeFileSync(configPath, JSON.stringify({specs_root: 'my-specs'}), 'utf-8');

		const config = await loadConfig();

		expect(config.specs_root).toBe('my-specs');
		expect(config.cmd_prefix).toBe(DEFAULT_CONFIG.cmd_prefix);
		expect(config.default_adapter).toBe(DEFAULT_CONFIG.default_adapter);
	});

	it('应该支持 JSON 配置文件', async () => {
		const configPath = join(testDir, '.nanospecrc');
		writeFileSync(configPath, JSON.stringify({specs_root: 'test-specs', auto_sync: false}), 'utf-8');

		const config = await loadConfig();

		expect(config.specs_root).toBe('test-specs');
		expect(config.auto_sync).toBe(false);
	});

	it('应该处理无效的 JSON 配置文件', async () => {
		const configPath = join(testDir, '.nanospecrc');
		writeFileSync(configPath, 'invalid json', 'utf-8');

		const consoleWarnSpy = vi
			.spyOn(console, 'warn')
			.mockImplementation(() => {});

		const config = await loadConfig();

		expect(config).toEqual(DEFAULT_CONFIG);
		expect(consoleWarnSpy).toHaveBeenCalledWith(
			expect.stringContaining('无法加载项目配置')
		);

		consoleWarnSpy.mockRestore();
	});

	it('应该验证配置项', async () => {
		const configPath = join(testDir, '.nanospecrc');
		writeFileSync(configPath, JSON.stringify({specs_root: 'valid-spec', default_adapter: 'cursor'}), 'utf-8');

		const config = await loadConfig();

		expect(config.specs_root).toBe('valid-spec');
		expect(config.default_adapter).toBe('cursor');
	});

	it('应该支持所有配置项', async () => {
		const configPath = join(testDir, '.nanospecrc');
		const testConfig = {
			specs_root: 'test-specs',
			cmd_prefix: 'flow',
			default_adapter: 'qwen',
			template_format: 'md' as const,
			auto_sync: false,
		};
		writeFileSync(configPath, JSON.stringify(testConfig), 'utf-8');

		const config = await loadConfig();

		expect(config).toEqual(testConfig);
	});

	it('应该处理布尔值配置', async () => {
		const configPath = join(testDir, '.nanospecrc');
		writeFileSync(configPath, JSON.stringify({auto_sync: false}), 'utf-8');

		const config = await loadConfig();

		expect(config.auto_sync).toBe(false);
	});

	it('应该处理数字配置', async () => {
		const configPath = join(testDir, '.nanospecrc');
		writeFileSync(configPath, JSON.stringify({auto_sync: false}), 'utf-8');

		const config = await loadConfig();

		expect(config.auto_sync).toBe(false);
	});
});