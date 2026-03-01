import {mkdirSync, writeFileSync} from 'fs';
import {join} from 'path';
import type {AIAdapter} from './index.js';
import {getCommandTemplate, parseTomlCommand, listAvailableCommands} from './utils.js';

export const copilotAdapter: AIAdapter = {
	name: 'copilot',
	supportedAssets: ['commands'],
	commandsDir: '.github/prompts/',
	fileFormat: 'md',
	supportsVariables: true,

	generateCommands(cwd: string, templatesDir: string): void {
		const commandsDir = join(cwd, '.github', 'prompts');
		mkdirSync(commandsDir, {recursive: true});

		const commands = listAvailableCommands();

		for (const cmd of commands) {
			const template = getCommandTemplate(templatesDir, 'copilot', cmd);
			if (!template) {
				console.warn(`⚠️  模板不存在: ${cmd}`);
				continue;
			}

			const content = this.transformCommand?.(template, cmd) || template;
			const dest = join(commandsDir, `${cmd}.prompt.md`);
			writeFileSync(dest, content, 'utf-8');
		}
	},

	transformCommand(content: string, commandName: string): string {
		const parsed = parseTomlCommand(content, commandName);
		const lines: string[] = [];

		lines.push('---');
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
