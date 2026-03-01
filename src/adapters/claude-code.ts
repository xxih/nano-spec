import {mkdirSync, writeFileSync} from 'fs';
import {join} from 'path';
import type {AIAdapter, AdapterGenerateOptions} from './index.js';
import {
	getCommandTemplate,
	getFileExtension,
	parseTomlCommand,
	listAvailableCommands,
	listAvailableSkills,
	copySkillToDir,
} from './utils.js';
import {resolveClaudeRoot} from './roots.js';

export const claudeCodeAdapter: AIAdapter = {
	name: 'claude-code',
	supportedAssets: ['commands', 'skills'],
	commandsDir: '.claude/commands/',
	fileFormat: 'md',
	supportsVariables: true,

	resolveCommandsDir(cwd: string, options?: AdapterGenerateOptions): string {
		return join(resolveClaudeRoot(cwd, options?.scope), 'commands');
	},

	resolveSkillsDir(cwd: string, options?: AdapterGenerateOptions): string {
		return join(resolveClaudeRoot(cwd, options?.scope), 'skills');
	},

	generateCommands(cwd: string, templatesDir: string, options?: AdapterGenerateOptions): void {
		const commandsDir = this.resolveCommandsDir?.(cwd, options) || join(cwd, '.claude', 'commands');
		mkdirSync(commandsDir, {recursive: true});

		const commands = listAvailableCommands();

		for (const cmd of commands) {
			const template = getCommandTemplate(templatesDir, 'claude-code', cmd);
			if (!template) {
				console.warn(`⚠️  模板不存在: ${cmd}`);
				continue;
			}

			const content = this.transformCommand?.(template, cmd) || template;
			const ext = getFileExtension(this.fileFormat);
			const dest = join(commandsDir, `${cmd}${ext}`);
			writeFileSync(dest, content, 'utf-8');
		}
	},

	generateSkills(cwd: string, templatesDir: string, options?: AdapterGenerateOptions): void {
		const skillsDir = this.resolveSkillsDir?.(cwd, options) || join(cwd, '.claude', 'skills');
		mkdirSync(skillsDir, {recursive: true});

		const availableSkills = listAvailableSkills();
		const selectedSkills =
			options?.skills && options.skills.length > 0
				? availableSkills.filter((skill) => options.skills?.includes(skill))
				: availableSkills;

		for (const skillName of selectedSkills) {
			copySkillToDir(skillName, skillsDir);
		}
	},

	transformCommand(content: string, commandName: string): string {
		const parsed = parseTomlCommand(content, commandName);
		const lines: string[] = [];

		lines.push('---');
		lines.push(`name: ${parsed.name}`);
		lines.push(`description: ${parsed.description}`);
		lines.push('---');
		lines.push('');

		let prompt = parsed.prompt;
		prompt = prompt.replace(/{{specs_root}}/g, 'nanospec');
		prompt = prompt.replace(/{{cmd_prefix}}/g, 'spec');
		lines.push(prompt);

		return lines.join('\n');
	},
};
