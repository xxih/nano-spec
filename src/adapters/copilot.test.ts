import {existsSync, mkdirSync, readFileSync, rmSync} from 'fs';
import {join} from 'path';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import {copilotAdapter} from './copilot.js';

describe('copilot adapter', () => {
	const testDir = join(process.cwd(), '.test-copilot-adapter');
	const templatesDir = join(process.cwd(), 'src', 'templates');

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

	it('应该有正确的适配器属性', () => {
		expect(copilotAdapter.name).toBe('copilot');
		expect(copilotAdapter.commandsDir).toBe('.github/copilot/commands/');
		expect(copilotAdapter.fileFormat).toBe('md');
		expect(copilotAdapter.supportsVariables).toBe(true);
		expect(typeof copilotAdapter.generateCommands).toBe('function');
		expect(typeof copilotAdapter.transformCommand).toBe('function');
	});

	it('应该创建 .github/copilot/commands/ 目录', () => {
		copilotAdapter.generateCommands(testDir, templatesDir);

		const commandsDir = join(testDir, '.github', 'copilot', 'commands');
		expect(existsSync(commandsDir)).toBe(true);
	});

	it('应该生成 6 个 Markdown 命令文件', () => {
		copilotAdapter.generateCommands(testDir, templatesDir);

		const commandsDir = join(testDir, '.github', 'copilot', 'commands');
		const expectedFiles = [
			'spec.1-spec.md',
			'spec.2-plan.md',
			'spec.3-execute.md',
			'spec.accept.md',
			'spec.align.md',
			'spec.summary.md'
		];

		for (const file of expectedFiles) {
			expect(existsSync(join(commandsDir, file))).toBe(true);
		}
	});

	it('生成的命令文件应该有内容', () => {
		copilotAdapter.generateCommands(testDir, templatesDir);

		const commandsDir = join(testDir, '.github', 'copilot', 'commands');
		const filePath = join(commandsDir, 'spec.1-spec.md');

		if (existsSync(filePath)) {
			const content = readFileSync(filePath, 'utf-8');
			expect(content.length).toBeGreaterThan(0);
		}
	});

	it('transformCommand 应该将 TOML 转换为 Markdown 格式', () => {
		const toml = `# Command: test
# Description: Test command
# Category: nanospec
# Version: 1

description = "Test command"
prompt = """Test prompt"""`;

		const result = copilotAdapter.transformCommand!(toml, 'test');
		expect(result).toContain('---');
		expect(result).toContain('name: test');
		expect(result).toContain('description: Test command');
		expect(result).toContain('Test prompt');
	});

	it('应该能够多次调用而不报错', () => {
		copilotAdapter.generateCommands(testDir, templatesDir);
		copilotAdapter.generateCommands(testDir, templatesDir);

		const commandsDir = join(testDir, '.github', 'copilot', 'commands');
		expect(existsSync(commandsDir)).toBe(true);
	});
});