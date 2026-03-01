import {describe, expect, it} from 'vitest';
import {createRequire} from 'node:module';
import {createProgram} from './index.js';

const require = createRequire(import.meta.url);
const {version: packageVersion} = require('../package.json') as {version: string};

describe('cli command registration', () => {
	it('should expose package version for --version', () => {
		const program = createProgram();

		expect(program.version()).toBe(packageVersion);
	});

	it('should register aliases for top-level commands', () => {
		const program = createProgram();
		const expectedAliases: Array<[string, string]> = [
			['init', 'i'],
			['new', 'n'],
			['switch', 's'],
			['status', 'st'],
			['preset', 'p'],
			['sync', 'sy'],
			['config', 'c'],
		];

		for (const [name, alias] of expectedAliases) {
			const command = program.commands.find((cmd) => cmd.name() === name);
			expect(command, `missing command: ${name}`).toBeDefined();
			expect(command?.aliases()).toContain(alias);
		}
	});

	it('should register alias for switch command as s', () => {
		const program = createProgram();
		const switchCommand = program.commands.find((cmd) => cmd.name() === 'switch');

		expect(switchCommand).toBeDefined();
		expect(switchCommand?.aliases()).toContain('s');
	});

	it('should register assets and scope options on init and sync', () => {
		const program = createProgram();
		const initCommand = program.commands.find((cmd) => cmd.name() === 'init');
		const syncCommand = program.commands.find((cmd) => cmd.name() === 'sync');

		expect(initCommand?.options.map((opt) => opt.long)).toContain('--assets');
		expect(initCommand?.options.map((opt) => opt.long)).toContain('--scope');
		expect(syncCommand?.options.map((opt) => opt.long)).toContain('--assets');
		expect(syncCommand?.options.map((opt) => opt.long)).toContain('--scope');
	});
});
