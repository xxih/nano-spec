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

		expect(initTemplate).toContain('nanospec new');
		expect(runTemplate).toContain('nanospec new');
	});

	it('should keep init template focused on task creation without environment detection', () => {
		const initTemplate = readFileSync(join(__dirname, 'spec.init.toml'), 'utf-8');

		expect(initTemplate).not.toContain('Step 1: 检测环境');
		expect(initTemplate).not.toContain('nanospec init --ai cursor');
		expect(initTemplate).toContain('执行创建任务流程');
	});

	it('should require clarification when task name cannot be extracted in init template', () => {
		const initTemplate = readFileSync(join(__dirname, 'spec.init.toml'), 'utf-8');

		expect(initTemplate).toContain('如果无法明确提取任务名');
		expect(initTemplate).toContain('不执行 `nanospec new`');
		expect(initTemplate).toContain('`research/`');
		expect(initTemplate).toContain('`bug-context/`');
		expect(initTemplate).toContain('`api/`');
	});
});
