import {describe, it, expect, beforeEach, afterEach, vi} from 'vitest';
import {existsSync, mkdirSync, rmSync, readFileSync} from 'fs';
import {join} from 'path';
import {geminiAdapter} from './gemini.js';

describe('gemini adapter', () => {
	const testDir = join(process.cwd(), '.test-gemini-adapter');
	const templatesDir = join(process.cwd(), 'src', 'templates');

	beforeEach(() => {
		if (existsSync(testDir)) {
			rmSync(testDir, {recursive: true, force: true});
		}
		mkdirSync(testDir, {recursive: true});
		vi.spyOn(process, 'cwd').mockReturnValue(testDir);
	});

	afterEach(() => {
		if (existsSync(testDir)) {
			rmSync(testDir, {recursive: true, force: true});
		}
		vi.restoreAllMocks();
	});

	it('应该有正确的适配器属性', () => {
		expect(geminiAdapter.name).toBe('gemini');
		expect(geminiAdapter.commandsDir).toBe('.gemini/commands/');
		expect(geminiAdapter.fileFormat).toBe('toml');
		expect(geminiAdapter.supportsVariables).toBe(false);
		expect(typeof geminiAdapter.generateCommands).toBe('function');
		expect(typeof geminiAdapter.transformCommand).toBe('function');
	});

	it('应该在 project scope 创建 .gemini/commands/ 目录', () => {
		geminiAdapter.generateCommands(testDir, templatesDir, {scope: 'project'});
		expect(existsSync(join(testDir, '.gemini', 'commands'))).toBe(true);
	});

	it('应该在 user scope 创建 ~/.gemini/commands/ 目录', () => {
		process.env.NANOSPEC_HOME_DIR = testDir;
		try {
			geminiAdapter.generateCommands(testDir, templatesDir, {scope: 'user'});
			expect(existsSync(join(testDir, '.gemini', 'commands'))).toBe(true);
		} finally {
			delete process.env.NANOSPEC_HOME_DIR;
		}
	});

	it('应该生成 TOML 命令文件', () => {
		geminiAdapter.generateCommands(testDir, templatesDir);
		const commandsDir = join(testDir, '.gemini', 'commands');
		expect(existsSync(join(commandsDir, 'spec.1-spec.toml'))).toBe(true);
		expect(existsSync(join(commandsDir, 'spec.run.toml'))).toBe(true);
	});

	it('生成的 TOML 文件应该有内容', () => {
		geminiAdapter.generateCommands(testDir, templatesDir);
		const filePath = join(testDir, '.gemini', 'commands', 'spec.1-spec.toml');

		if (existsSync(filePath)) {
			const content = readFileSync(filePath, 'utf-8');
			expect(content.length).toBeGreaterThan(0);
			expect(content).toMatch(/description =/);
		}
	});
});
