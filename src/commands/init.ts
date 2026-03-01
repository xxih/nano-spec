import {cpSync, existsSync, mkdirSync, writeFileSync} from 'fs';
import {homedir} from 'os';
import {dirname, join} from 'path';
import {fileURLToPath} from 'url';
import inquirer from 'inquirer';
import {getAdapter, listAdapters, type AIAdapter} from '../adapters/index.js';
import {listAvailableCommands, listAvailableSkills} from '../adapters/utils.js';
import {loadConfig} from '../config/config.js';

type AssetMode = 'commands' | 'skills' | 'both';
type CodexScope = 'project' | 'user';

interface InitOptions {
	ai?: string;
	assets?: string;
	scope?: string;
	force?: boolean;
}

interface InteractiveAnswers {
	adapters: string[];
	assets: AssetMode;
	scope: CodexScope;
}

export async function init(options: InitOptions): Promise<void> {
	// 如果指定了 AI 工具，使用非交互式快速初始化
	if (options.ai) {
		await quickInit(options);
		return;
	}

	// 默认使用交互式向导
	await interactiveInit(options);
}

/**
 * 快速初始化（非交互式）
 */
async function quickInit(options: InitOptions): Promise<void> {
	const cwd = process.cwd();
	const config = await loadConfig(cwd);

	// 使用指定的 AI 工具
	const aiTool = options.ai || config.default_adapter || 'cursor';
	const assetMode = resolveAssetMode(options.assets, config.default_assets || 'commands');
	const scope = resolveCodexScope(options.scope, config.codex_scope || 'user');

	const nanospecDir = join(cwd, config.specs_root || 'nanospec');

	if (existsSync(nanospecDir) && !options.force) {
		console.log('⚠️  nanospec/ 目录已存在，使用 --force 强制覆盖');
		return;
	}

	const adapter = getAdapter(aiTool);
	if (!adapter) {
		console.log(`❌ 不支持的 AI 工具: ${aiTool}`);
		console.log(`   支持: ${listAdapters().join(', ')}`);
		return;
	}

	// 创建 nanospec 目录结构
	mkdirSync(nanospecDir, {recursive: true});

	const __filename = fileURLToPath(import.meta.url);
	const __dirname = dirname(__filename);

	// 创建 .nanospec 目录
	const configDir = join(cwd, '.nanospec');
	mkdirSync(configDir, {recursive: true});

	// 复制 AGENTS.md（从 dist/static/_AGENTS.md 查找）
	const agentsSrc = join(__dirname, '../../dist/static/_AGENTS.md');
	if (existsSync(agentsSrc)) {
		copyFile(agentsSrc, join(configDir, 'AGENTS.md'));
		console.log(`✓ 创建 .nanospec/AGENTS.md`);
	} else {
		console.warn('⚠️  未找到 AGENTS.md，跳过复制');
	}

	syncAdapterAssets(cwd, __dirname, aiTool, adapter, assetMode, scope, config.enabled_skills);

	console.log('\n🎉 nanospec 初始化完成！');
	console.log('\n下一步：');
	console.log('  1. nanospec new "任务名称"  创建任务目录');
	console.log('  2. 编辑 brief.md 描述需求');
	console.log('  3. 使用 /spec.1-spec 开始规格撰写');
}

async function interactiveInit(options: InitOptions): Promise<void> {
	const cwd = process.cwd();
	const config = await loadConfig(cwd);

	console.log('\n🚀 Nano Spec 交互式初始化向导\n');

	// 询问用户选择 AI 工具
	const adapterChoices = listAdapters().map((name) => {
		const adapter = getAdapter(name);
		return {
			name: `${adapter?.name || name} (${adapter?.commandsDir})`,
			value: name,
			checked: name === config.default_adapter || name === 'cursor',
		};
	});

	const answers = await inquirer.prompt<InteractiveAnswers>([
		{
			type: 'checkbox',
			name: 'adapters',
			message: '选择要支持的 AI 工具（可多选）：',
			choices: adapterChoices,
			validate: (input: string[]) => {
				if (input.length === 0) {
					return '请至少选择一个 AI 工具';
				}
				return true;
			},
		},
		{
			type: 'list',
			name: 'assets',
			message: '选择要同步的资产类型：',
			default: resolveAssetMode(undefined, config.default_assets || 'commands'),
			choices: [
				{name: 'commands（slash commands）', value: 'commands'},
				{name: 'skills', value: 'skills'},
				{name: 'both（commands + skills）', value: 'both'},
			],
		},
		{
			type: 'list',
			name: 'scope',
			message: 'codex 输出作用域：',
			default: resolveCodexScope(undefined, config.codex_scope || 'user'),
			choices: [
				{name: 'user（~/.codex/*）', value: 'user'},
				{name: 'project（./.codex/*）', value: 'project'},
			],
		},
	]);

	// 使用默认配置
	const defaultConfig = {
		specs_root: config.specs_root || 'nanospec',
		cmd_prefix: config.cmd_prefix || 'spec',
		default_adapter: answers.adapters[0] || 'cursor',
		template_format: 'md' as const,
		auto_sync: true,
		default_assets: answers.assets,
		codex_scope: answers.scope,
		enabled_skills: config.enabled_skills || [],
	};

	// 创建配置文件
	const configDir = join(cwd, '.nanospec');
	mkdirSync(configDir, {recursive: true});

	writeFileSync(
		join(configDir, 'config.json'),
		JSON.stringify(defaultConfig, null, 2),
		'utf-8',
	);

	console.log(`\n✓ 创建 .nanospec/config.json`);

	// 创建 nanospec 目录结构
	const nanospecDir = join(cwd, defaultConfig.specs_root);
	mkdirSync(nanospecDir, {recursive: true});

	const __filename = fileURLToPath(import.meta.url);
	const __dirname = dirname(__filename);

	// 复制 AGENTS.md（从 dist/static/_AGENTS.md 查找）
	const agentsSrc = join(__dirname, '../../dist/static/_AGENTS.md');
	if (existsSync(agentsSrc)) {
		copyFile(agentsSrc, join(configDir, 'AGENTS.md'));
		console.log(`✓ 创建 .nanospec/AGENTS.md`);
	} else {
		console.warn('⚠️  未找到 AGENTS.md，跳过复制');
	}

	// 为每个选中的 AI 工具生成资产
	for (const adapterName of answers.adapters) {
		const adapter = getAdapter(adapterName);
		if (adapter) {
			syncAdapterAssets(cwd, __dirname, adapterName, adapter, answers.assets, answers.scope, defaultConfig.enabled_skills);
		}
	}

	console.log('\n🎉 nanospec 初始化完成！');
	console.log('\n配置信息：');
	console.log(`  - 规格根目录: ${defaultConfig.specs_root}`);
	console.log(`  - 命令前缀: ${defaultConfig.cmd_prefix}`);
	console.log(`  - 默认 AI 工具: ${defaultConfig.default_adapter}`);
	console.log(`  - 支持的 AI 工具: ${answers.adapters.join(', ')}`);
	console.log(`  - 默认资产: ${defaultConfig.default_assets}`);
	console.log(`  - codex 作用域: ${defaultConfig.codex_scope}`);
	console.log('\n如需修改配置，可使用：');
	console.log('  - nanospec config set <key> <value>');
	console.log('  - nanospec config --list');
	console.log('\n下一步：');
	console.log('  1. nanospec new "任务名称"  创建任务目录');
	console.log('  2. 编辑 brief.md 描述需求');
	console.log('  3. 使用 /spec.1-spec 开始规格撰写');
}

function syncAdapterAssets(
	cwd: string,
	templatesDir: string,
	adapterName: string,
	adapter: AIAdapter,
	assetMode: AssetMode,
	scope: CodexScope,
	enabledSkills?: string[]
): void {
	if (supportsCommands(assetMode)) {
		adapter.generateCommands(cwd, templatesDir, {scope});
		const targetDir =
			adapterName === 'codex'
				? join(resolveCodexRoot(cwd, scope), 'prompts')
				: join(cwd, adapter.commandsDir);
		console.log(`✓ 创建 ${targetDir} (${listAvailableCommands().length} 个命令)`);
	}

	if (supportsSkills(assetMode)) {
		if (adapter.generateSkills) {
			const availableSkills = listAvailableSkills();
			const selectedSkills =
				enabledSkills && enabledSkills.length > 0
					? availableSkills.filter((skill) => enabledSkills.includes(skill))
					: availableSkills;

			adapter.generateSkills(cwd, templatesDir, {scope, skills: enabledSkills});
			const targetDir =
				adapterName === 'codex'
					? join(resolveCodexRoot(cwd, scope), 'skills')
					: join(cwd, '.skills');
			console.log(`✓ 创建 ${targetDir} (${selectedSkills.length} 个 skills)`);
		} else {
			console.log(`⚠️  ${adapter.name} 暂不支持 skills，已跳过`);
		}
	}
}

function resolveAssetMode(input: string | undefined, fallback: AssetMode): AssetMode {
	if (input === 'commands' || input === 'skills' || input === 'both') {
		return input;
	}
	return fallback;
}

function resolveCodexScope(input: string | undefined, fallback: CodexScope): CodexScope {
	if (input === 'project' || input === 'user') {
		return input;
	}
	return fallback;
}

function supportsCommands(mode: AssetMode): boolean {
	return mode === 'commands' || mode === 'both';
}

function supportsSkills(mode: AssetMode): boolean {
	return mode === 'skills' || mode === 'both';
}

function resolveCodexRoot(cwd: string, scope: CodexScope): string {
	if (scope === 'user') {
		const homeDir = process.env.NANOSPEC_HOME_DIR || homedir();
		return join(homeDir, '.codex');
	}

	return join(cwd, '.codex');
}

function copyFile(src: string, dest: string): void {
	const dir = dirname(dest);
	if (!existsSync(dir)) {
		mkdirSync(dir, {recursive: true});
	}
	if (existsSync(src)) {
		cpSync(src, dest);
	}
}
