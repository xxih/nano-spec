import {mkdtempSync, readFileSync, existsSync} from 'fs';
import {tmpdir} from 'os';
import {join} from 'path';
import {spawnSync} from 'child_process';
import {describe, expect, it} from 'vitest';

const getLocalDatePrefix = () => {
	const now = new Date();
	const year = now.getFullYear();
	const month = String(now.getMonth() + 1).padStart(2, '0');
	const day = String(now.getDate()).padStart(2, '0');
	return `${year}${month}${day}`;
};

describe('create-task-skeleton script', () => {
	it('should create a dated task skeleton and update .current when requested', () => {
		const workdir = mkdtempSync(join(tmpdir(), 'nanospec-skill-'));
		const scriptPath = join(process.cwd(), 'src/static/skills/nanospec/scripts/create-task-skeleton.sh');
		const result = spawnSync('sh', [scriptPath, '支付 回调', '--set-current'], {
			cwd: workdir,
			encoding: 'utf-8',
		});

		expect(result.status).toBe(0);

		const today = getLocalDatePrefix();
		const dirName = `${today}-支付-回调`;
		const taskDir = join(workdir, 'nanospec', dirName);

		expect(existsSync(join(taskDir, 'assets'))).toBe(true);
		expect(existsSync(join(taskDir, 'outputs', '1-spec.md'))).toBe(true);
		expect(existsSync(join(taskDir, 'outputs', '2-plan.md'))).toBe(true);
		expect(existsSync(join(taskDir, 'outputs', '3-tasks.md'))).toBe(true);
		expect(readFileSync(join(workdir, '.nanospec', '.current'), 'utf-8').trim()).toBe(dirName);
		expect(readFileSync(join(taskDir, 'brief.md'), 'utf-8')).toContain('# 支付 回调');
	});

	it('should preserve an explicit dated directory name', () => {
		const workdir = mkdtempSync(join(tmpdir(), 'nanospec-skill-'));
		const scriptPath = join(process.cwd(), 'src/static/skills/nanospec/scripts/create-task-skeleton.sh');
		const result = spawnSync('sh', [scriptPath, '20260315-支付回调重试'], {
			cwd: workdir,
			encoding: 'utf-8',
		});

		expect(result.status).toBe(0);
		expect(existsSync(join(workdir, 'nanospec', '20260315-支付回调重试', 'alignment.md'))).toBe(true);
		expect(existsSync(join(workdir, '.nanospec', '.current'))).toBe(false);
	});
});
