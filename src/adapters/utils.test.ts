import {existsSync, mkdirSync, readFileSync, rmSync} from 'fs';
import {join} from 'path';
import {afterEach, beforeEach, describe, expect, it} from 'vitest';
import {
	copySkillToDir,
	getSkillSourceDir,
	listAvailableCommands,
	listAvailableSkills,
} from './utils.js';

describe('listAvailableCommands', () => {
	it('should return array of command names without .toml extension', () => {
		const commands = listAvailableCommands();

		expect(Array.isArray(commands)).toBe(true);

		// Check that all commands don't have .toml extension
		commands.forEach((cmd) => {
			expect(cmd).not.toMatch(/\.toml$/);
		});

		// Check that commands are sorted
		const sortedCommands = [...commands].sort();
		expect(commands).toEqual(sortedCommands);
	});

	it('should include expected core commands', () => {
		const commands = listAvailableCommands();

		const expectedCommands = [
			'spec.1-spec',
			'spec.2-plan',
			'spec.3-execute',
			'spec.accept',
			'spec.align',
			'spec.summary',
		];

		expectedCommands.forEach((cmd) => {
			expect(commands).toContain(cmd);
		});
	});

	it('should include new commands (spec.init, spec.run, spec.clarify)', () => {
		const commands = listAvailableCommands();

		const newCommands = ['spec.init', 'spec.run', 'spec.clarify'];

		newCommands.forEach((cmd) => {
			expect(commands).toContain(cmd);
		});
	});

	it('should return at least 9 commands', () => {
		const commands = listAvailableCommands();
		expect(commands.length).toBeGreaterThanOrEqual(9);
	});
});

describe('skills utils', () => {
	const testDir = join(process.cwd(), '.test-skills-utils');

	beforeEach(() => {
		if (existsSync(testDir)) {
			rmSync(testDir, {recursive: true, force: true});
		}
		mkdirSync(testDir, {recursive: true});
	});

	afterEach(() => {
		if (existsSync(testDir)) {
			rmSync(testDir, {recursive: true, force: true});
		}
	});

	it('should list built-in skills', () => {
		const skills = listAvailableSkills();
		expect(skills).toContain('nanospec-workflow');
		expect(skills).toContain('nanospec-align');
	});

	it('should resolve skill source directory', () => {
		const skillDir = getSkillSourceDir('nanospec-workflow');
		expect(skillDir).toBeTruthy();
		expect(skillDir).toContain('nanospec-workflow');
	});

	it('should copy skill folder to destination root', () => {
		const copied = copySkillToDir('nanospec-align', testDir);
		expect(copied).toBe(true);

		const copiedSkill = join(testDir, 'nanospec-align', 'SKILL.md');
		expect(existsSync(copiedSkill)).toBe(true);
		expect(readFileSync(copiedSkill, 'utf-8')).toContain('name: nanospec-align');
	});
});
