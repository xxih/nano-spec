import {readFileSync} from 'fs';
import {join, dirname} from 'path';
import {fileURLToPath} from 'url';
import {describe, expect, it} from 'vitest';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

describe('command templates', () => {
	it('should not contain legacy specflow command references', () => {
		const initTemplate = readFileSync(join(__dirname, 'spec.init.toml'), 'utf-8');
		const runTemplate = readFileSync(join(__dirname, 'spec.run.toml'), 'utf-8');

		expect(initTemplate.toLowerCase()).not.toContain('specflow');
		expect(runTemplate.toLowerCase()).not.toContain('specflow');
	});

	it('should use nanospec commands in init and run templates', () => {
		const initTemplate = readFileSync(join(__dirname, 'spec.init.toml'), 'utf-8');
		const runTemplate = readFileSync(join(__dirname, 'spec.run.toml'), 'utf-8');

		expect(initTemplate).toContain('nanospec init');
		expect(initTemplate).toContain('nanospec new');
		expect(runTemplate).toContain('nanospec new');
	});
});
