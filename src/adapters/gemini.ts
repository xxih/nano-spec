import {mkdirSync, writeFileSync} from 'fs';
import {join} from 'path';
import type {AIAdapter, AdapterGenerateOptions} from './index.js';
import {getCommandTemplate, getFileExtension, listAvailableCommands} from './utils.js';
import {resolveGeminiRoot} from './roots.js';

export const geminiAdapter: AIAdapter = {
	name: 'gemini',
	supportedAssets: ['commands'],
	commandsDir: '.gemini/commands/',
	fileFormat: 'toml',
	supportsVariables: false,

	resolveCommandsDir(cwd: string, options?: AdapterGenerateOptions): string {
		return join(resolveGeminiRoot(cwd, options?.scope), 'commands');
	},

	generateCommands(cwd: string, templatesDir: string, options?: AdapterGenerateOptions): void {
		const commandsDir = this.resolveCommandsDir?.(cwd, options) || join(cwd, '.gemini', 'commands');
		mkdirSync(commandsDir, {recursive: true});

		const commands = listAvailableCommands();

		for (const cmd of commands) {
			const template = getCommandTemplate(templatesDir, 'gemini', cmd);
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

	transformCommand(content: string): string {
		return content;
	},
};
