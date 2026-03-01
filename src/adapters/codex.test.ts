import {existsSync, mkdirSync, readFileSync, rmSync} from 'fs';
import {join} from 'path';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import {codexAdapter} from './codex.js';

describe('codex adapter', () => {
	const testDir = join(process.cwd(), '.test-codex-adapter');
	const templatesDir = join(process.cwd(), 'src', 'templates');

	beforeEach(() => {
		if (existsSync(testDir)) {
			rmSync(testDir, {recursive: true, force: true});
		}
		mkdirSync(testDir, {recursive: true});

		vi.spyOn(process, 'cwd').mockReturnValue(testDir);
		process.env.NANOSPEC_HOME_DIR = testDir;
	});

	afterEach(() => {
		if (existsSync(testDir)) {
			rmSync(testDir, {recursive: true, force: true});
		}
		delete process.env.NANOSPEC_HOME_DIR;
		vi.restoreAllMocks();
	});

	it('应该有正确的适配器属性', () => {
		expect(codexAdapter.name).toBe('codex');
		expect(codexAdapter.supportedAssets).toEqual(['commands', 'skills']);
		expect(codexAdapter.commandsDir).toBe('.codex/prompts/');
		expect(codexAdapter.fileFormat).toBe('md');
		expect(codexAdapter.supportsVariables).toBe(true);
		expect(typeof codexAdapter.generateCommands).toBe('function');
		expect(typeof codexAdapter.generateSkills).toBe('function');
		expect(typeof codexAdapter.transformCommand).toBe('function');
	});

	it('应该在 project scope 创建 .codex/prompts/ 目录', () => {
		codexAdapter.generateCommands(testDir, templatesDir, {scope: 'project'});
		expect(existsSync(join(testDir, '.codex', 'prompts'))).toBe(true);
	});

	it('应该在 user scope 创建 ~/.codex/prompts/ 目录', () => {
		codexAdapter.generateCommands(testDir, templatesDir, {scope: 'user'});
		expect(existsSync(join(testDir, '.codex', 'prompts'))).toBe(true);
	});

	it('应该生成核心 Markdown 命令文件', () => {
		codexAdapter.generateCommands(testDir, templatesDir, {scope: 'project'});

		const commandsDir = join(testDir, '.codex', 'prompts');
		const expectedFiles = [
			'spec.1-spec.md',
			'spec.2-plan.md',
			'spec.3-execute.md',
			'spec.accept.md',
			'spec.align.md',
			'spec.summary.md',
		];

		for (const file of expectedFiles) {
			expect(existsSync(join(commandsDir, file))).toBe(true);
		}
	});

	it('transformCommand 应该将 TOML 转换为 Markdown 格式', () => {
		const toml = `# Command: test
# Description: Test command
# Category: nanospec
# Version: 1

description = "Test command"
prompt = """Test prompt"""`;

		const result = codexAdapter.transformCommand!(toml, 'test');
		expect(result).toContain('---');
		expect(result).toContain('name: test');
		expect(result).toContain('description: Test command');
		expect(result).toContain('Test prompt');
	});

	it('应该生成 skills 到 .codex/skills/', () => {
		codexAdapter.generateSkills!(testDir, templatesDir, {scope: 'project'});
		const skillPath = join(testDir, '.codex', 'skills', 'nanospec-workflow', 'SKILL.md');
		expect(existsSync(skillPath)).toBe(true);
		expect(readFileSync(skillPath, 'utf-8')).toContain('name: nanospec-workflow');
	});

	it('应该按 skills 过滤条件生成指定技能', () => {
		codexAdapter.generateSkills!(testDir, templatesDir, {
			scope: 'project',
			skills: ['nanospec-align'],
		});

		expect(existsSync(join(testDir, '.codex', 'skills', 'nanospec-align', 'SKILL.md'))).toBe(true);
		expect(existsSync(join(testDir, '.codex', 'skills', 'nanospec-workflow', 'SKILL.md'))).toBe(false);
	});
});
