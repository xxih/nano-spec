import {describe, expect, it} from 'vitest';
import {createProgram} from './index.js';

describe('cli command registration', () => {
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
});
