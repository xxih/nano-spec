import {readdirSync, readFileSync} from 'fs';
import {dirname, join} from 'path';
import {fileURLToPath} from 'url';
import {describe, expect, it} from 'vitest';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const repoRoot = join(__dirname, '..', '..', '..', '..');
const projectSkillDir = join(repoRoot, '.codex', 'skills', 'nanospec');
const referenceFiles = readdirSync(join(__dirname, 'references')).sort();
const scriptFiles = readdirSync(join(__dirname, 'scripts')).sort();

const readPublishedFile = (relativePath: string) =>
	readFileSync(join(__dirname, relativePath), 'utf-8');

const readProjectFile = (relativePath: string) =>
	readFileSync(join(projectSkillDir, relativePath), 'utf-8');

describe('nanospec skill content', () => {
	it('should keep published skill and project skill copies aligned', () => {
		const files = [
			'SKILL.md',
			...referenceFiles.map((file) => join('references', file)),
			...scriptFiles.map((file) => join('scripts', file)),
		];

		files.forEach((relativePath) => {
			expect(readProjectFile(relativePath)).toBe(readPublishedFile(relativePath));
		});
	});

	it('should use Chinese headings across the skill docs', () => {
		const files = ['SKILL.md', ...referenceFiles.map((file) => join('references', file))];
		const forbiddenHeadings = [
			/^## Objective$/m,
			/^## Steps$/m,
			/^## Rules$/m,
			/^## Core Workflow$/m,
			/^## Progressive References$/m,
			/^## Global Rules$/m,
			/^# Run$/m,
			/^# Init$/m,
			/^# Onboard$/m,
		];

		files.forEach((relativePath) => {
			const content = readPublishedFile(relativePath);
			forbiddenHeadings.forEach((pattern) => {
				expect(content).not.toMatch(pattern);
			});
		});

		expect(readPublishedFile('SKILL.md')).toContain('## 任务目录结构');
		expect(readPublishedFile('SKILL.md')).toContain('## Align 机制');
		expect(readPublishedFile('SKILL.md')).toContain('## 路由方式');
		expect(readPublishedFile('SKILL.md')).toContain('## 辅助脚本');
	});

	it('should document a CLI-free workflow for init, run, and onboarding', () => {
		const skillContent = readPublishedFile('SKILL.md');
		const initContent = readPublishedFile(join('references', 'init.md'));
		const runContent = readPublishedFile(join('references', 'run.md'));
		const onboardContent = readPublishedFile(join('references', 'onboard.md'));

		expect(skillContent).toContain('仓库里没有 `nanospec` CLI 时');
		expect(skillContent).toContain('`.nanospec/.current` 只是任务指针');
		expect(skillContent).toContain('用户完全可以只采用这套目录规范');
		expect(skillContent).toContain('可以直接用 `/xxx` 把请求路由到对应阶段');
		expect(skillContent).toContain('`/run`：让 NanoSpec 按缺失阶段续跑完整 workflow');
		expect(skillContent).toContain('scripts/create_task_skeleton.py');
		expect(skillContent).toContain('`research/`');
		expect(skillContent).toContain('`bug-context/`');
		expect(skillContent).toContain('`api/`');

		expect(initContent).toContain('不依赖 `nanospec` CLI');
		expect(initContent).toContain('python3 scripts/create_task_skeleton.py');
		expect(initContent).toContain('`assets/` 下建议附带 `README.md`');
		expect(initContent).toContain('`research/`');
		expect(initContent).toContain('`bug-context/`');
		expect(initContent).toContain('`api/`');
		expect(initContent).not.toContain('nanospec new <task-name>');

		expect(runContent).toContain('不依赖 `nanospec` CLI');
		expect(runContent).toContain('python3 scripts/create_task_skeleton.py');
		expect(runContent).toContain('不把 `nanospec new`、`nanospec init` 当成前置条件');

		expect(onboardContent).toContain('不要求先安装 CLI');
		expect(onboardContent).not.toContain('nanospec --version');
	});

	it('should prioritize align and require timestamp-prefixed task names', () => {
		const skillContent = readPublishedFile('SKILL.md');
		const initContent = readPublishedFile(join('references', 'init.md'));
		const runContent = readPublishedFile(join('references', 'run.md'));
		const alignContent = readPublishedFile(join('references', 'align.md'));
		const onboardContent = readPublishedFile(join('references', 'onboard.md'));

		expect(skillContent).toContain('新建任务目录名必须使用 `YYYYMMDD-任务主题` 格式');
		expect(skillContent).toContain('先执行 align');
		expect(skillContent).toContain('align 不是可选补记');
		expect(skillContent).toContain('完整的 spec-driven workflow 是可选路由');
		expect(skillContent).toContain('当其他 skill 采用“先 plan 后 xxx”模式时');
		expect(skillContent).toContain('align 不是一个孤立阶段');
		expect(skillContent).toContain('触发 align 的时机不限于 `/align`');
		expect(skillContent).toContain('`/align`：执行对齐纠偏，并传播变更');

		expect(initContent).toContain('YYYYMMDD-任务主题');
		expect(initContent).toContain('任务名必须以当前日期前缀 `YYYYMMDD-` 开头');

		expect(runContent).toContain('先执行 align');
		expect(runContent).toContain('新建任务目录名必须使用 `YYYYMMDD-任务主题` 格式');

		expect(alignContent).toContain('先暂停当前阶段，立即进入 align');
		expect(alignContent).toContain('align 不是可选补记');
		expect(alignContent).toContain('跨 skill 的纠偏入口');

		expect(onboardContent).toContain('按 `YYYYMMDD-任务主题` 格式创建任务目录');
	});
});
