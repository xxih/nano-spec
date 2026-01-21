import {existsSync, mkdirSync, readFileSync, rmSync, writeFileSync} from 'fs';
import {join} from 'path';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import {config as configCommand} from './config.js';

describe('config command', () => {
	const testDir = join(process.cwd(), '.test-nanospec-config');
	const nanospecDir = join(testDir, '.nanospec');
	const configPath = join(nanospecDir, 'config.json');

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

	it('应该列出默认配置（无配置文件时）', async () => {
		const consoleLogSpy = vi
			.spyOn(console, 'log')
			.mockImplementation(() => {});

		await configCommand('list');

		expect(consoleLogSpy).toHaveBeenCalledWith(
			expect.stringContaining('specs_root')
		);
		expect(consoleLogSpy).toHaveBeenCalledWith(
			expect.stringContaining('nanospec')
		);

		consoleLogSpy.mockRestore();
	});

	it('应该设置配置值', async () => {
		mkdirSync(nanospecDir, {recursive: true});

		await configCommand('set', 'specs_root', 'my-specs');

		expect(existsSync(configPath)).toBe(true);

		const content = readFileSync(configPath, 'utf-8');
		const config = JSON.parse(content);
		expect(config.specs_root).toBe('my-specs');
	});

	it('应该获取配置值', async () => {
		mkdirSync(nanospecDir, {recursive: true});

		// 先设置配置
		writeFileSync(configPath, JSON.stringify({specs_root: 'test-specs'}, null, 2), 'utf-8');

		const consoleLogSpy = vi
			.spyOn(console, 'log')
			.mockImplementation(() => {});

		await configCommand('get', 'specs_root');

		expect(consoleLogSpy).toHaveBeenCalledWith('specs_root = test-specs');

		consoleLogSpy.mockRestore();
	});

	it('应该获取默认配置值（未设置时）', async () => {
		mkdirSync(nanospecDir, {recursive: true});

		const consoleLogSpy = vi
			.spyOn(console, 'log')
			.mockImplementation(() => {});

		await configCommand('get', 'specs_root');

		expect(consoleLogSpy).toHaveBeenCalledWith('specs_root = nanospec');

		consoleLogSpy.mockRestore();
	});

	it('应该删除配置项', async () => {
		mkdirSync(nanospecDir, {recursive: true});

		// 先设置配置
		writeFileSync(configPath, JSON.stringify({specs_root: 'test-specs', cmd_prefix: 'flow'}, null, 2), 'utf-8');

		await configCommand('unset', 'specs_root');

		const content = readFileSync(configPath, 'utf-8');
		const config = JSON.parse(content);
		expect(config.specs_root).toBeUndefined();
		expect(config.cmd_prefix).toBe('flow');
	});

	it('应该列出所有配置项', async () => {
		mkdirSync(nanospecDir, {recursive: true});

		// 设置一些配置
		writeFileSync(configPath, JSON.stringify({specs_root: 'my-specs', default_adapter: 'qwen'}, null, 2), 'utf-8');

		const consoleLogSpy = vi
			.spyOn(console, 'log')
			.mockImplementation(() => {});

		await configCommand('list');

		expect(consoleLogSpy).toHaveBeenCalledWith(
			expect.stringContaining('specs_root')
		);
		expect(consoleLogSpy).toHaveBeenCalledWith(
			expect.stringContaining('my-specs')
		);
		expect(consoleLogSpy).toHaveBeenCalledWith(
			expect.stringContaining('default_adapter')
		);
		expect(consoleLogSpy).toHaveBeenCalledWith(
			expect.stringContaining('qwen')
		);

		consoleLogSpy.mockRestore();
	});

	it('应该支持布尔值配置', async () => {
		mkdirSync(nanospecDir, {recursive: true});

		await configCommand('set', 'auto_sync', 'true');

		const content = readFileSync(configPath, 'utf-8');
		const config = JSON.parse(content);
		expect(config.auto_sync).toBe(true);
	});

	it('应该处理无效的 JSON 配置文件', async () => {
		mkdirSync(nanospecDir, {recursive: true});

		// 写入无效的 JSON
		writeFileSync(configPath, 'invalid json', 'utf-8');

		const consoleLogSpy = vi
			.spyOn(console, 'log')
			.mockImplementation(() => {});

		await configCommand('list');

		// 应该显示默认配置
		expect(consoleLogSpy).toHaveBeenCalledWith(
			expect.stringContaining('specs_root')
		);

		consoleLogSpy.mockRestore();
	});
});