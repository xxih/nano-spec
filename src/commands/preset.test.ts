import {existsSync, mkdirSync, readFileSync, rmSync, writeFileSync} from 'fs';
import {join} from 'path';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import {installPreset, listPresets, uninstallPreset} from './preset.js';

describe('preset command', () => {
	const testDir = join(process.cwd(), '.test-nanospec-preset');
	const nanospecDir = join(testDir, 'nanospec');
	const iflowDir = join(testDir, '.iflow');
	const commandsDir = join(iflowDir, 'commands');

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

	describe('listPresets', () => {
		it('应该列出所有可用预设', async () => {
			const consoleLogSpy = vi
				.spyOn(console, 'log')
				.mockImplementation(() => {});

			await listPresets();

			expect(consoleLogSpy).toHaveBeenCalledWith(
				expect.stringContaining('可用预设')
			);

			consoleLogSpy.mockRestore();
		});
	});

	describe('installPreset', () => {
		it('应该在预设不存在时显示错误', async () => {
			const consoleLogSpy = vi
				.spyOn(console, 'log')
				.mockImplementation(() => {});

			await installPreset('nonexistent-preset');

			expect(consoleLogSpy).toHaveBeenCalledWith(
				expect.stringContaining('预设不存在')
			);

			consoleLogSpy.mockRestore();
		});

		it('应该安装预设（frontend）', async () => {
			mkdirSync(nanospecDir, {recursive: true});
			mkdirSync(iflowDir, {recursive: true});

			const consoleLogSpy = vi
				.spyOn(console, 'log')
				.mockImplementation(() => {});

			await installPreset('frontend');

			expect(consoleLogSpy).toHaveBeenCalledWith(
				expect.stringContaining('正在安装预设')
			);
			expect(consoleLogSpy).toHaveBeenCalledWith(
				expect.stringContaining('安装完成')
			);

			consoleLogSpy.mockRestore();
		});

		it('应该安装预设（backend）', async () => {
			mkdirSync(nanospecDir, {recursive: true});
			mkdirSync(iflowDir, {recursive: true});

			const consoleLogSpy = vi
				.spyOn(console, 'log')
				.mockImplementation(() => {});

			await installPreset('backend');

			expect(consoleLogSpy).toHaveBeenCalledWith(
				expect.stringContaining('正在安装预设')
			);

			consoleLogSpy.mockRestore();
		});

		it('应该安装预设（docs）', async () => {
			mkdirSync(nanospecDir, {recursive: true});
			mkdirSync(iflowDir, {recursive: true});

			const consoleLogSpy = vi
				.spyOn(console, 'log')
				.mockImplementation(() => {});

			await installPreset('docs');

			expect(consoleLogSpy).toHaveBeenCalledWith(
				expect.stringContaining('正在安装预设')
			);

			consoleLogSpy.mockRestore();
		});

		it('应该安装预设（refactor）', async () => {
			mkdirSync(nanospecDir, {recursive: true});
			mkdirSync(iflowDir, {recursive: true});

			const consoleLogSpy = vi
				.spyOn(console, 'log')
				.mockImplementation(() => {});

			await installPreset('refactor');

			expect(consoleLogSpy).toHaveBeenCalledWith(
				expect.stringContaining('正在安装预设')
			);

			consoleLogSpy.mockRestore();
		});
	});

	describe('uninstallPreset', () => {
		it('应该在预设不存在时显示错误', async () => {
			const consoleLogSpy = vi
				.spyOn(console, 'log')
				.mockImplementation(() => {});

			await uninstallPreset('nonexistent-preset');

			expect(consoleLogSpy).toHaveBeenCalledWith(
				expect.stringContaining('预设不存在')
			);

			consoleLogSpy.mockRestore();
		});

		it('应该显示卸载提示', async () => {
			const consoleLogSpy = vi
				.spyOn(console, 'log')
				.mockImplementation(() => {});

			await uninstallPreset('frontend');

			expect(consoleLogSpy).toHaveBeenCalledWith(
				expect.stringContaining('卸载预设需要手动删除')
			);

			consoleLogSpy.mockRestore();
		});
	});
});