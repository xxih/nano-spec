import {cpSync, existsSync, mkdirSync, writeFileSync} from 'fs';
import {dirname, join} from 'path';
import {fileURLToPath} from 'url';
import inquirer from 'inquirer';
import {getAdapter, listAdapters} from '../adapters/index.js';
import {loadConfig} from '../config/config.js';

interface InitOptions {
	ai?: string;
	force?: boolean;
}

interface InteractiveAnswers {
	adapters: string[];
	specs_root: string;
	cmd_prefix: string;
	default_adapter: string;
}

export async function init(options: InitOptions): Promise<void> {
	const cwd = process.cwd();

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

	// 生成 AI 工具的命令文件（使用内置的 .iflow/commands/ 模板）
	adapter.generateCommands(cwd, __dirname);
	console.log(`✓ 创建 ${adapter.commandsDir} (9 个命令)`);

	console.log('\n🎉 nanospec 初始化完成！');
	console.log('\n下一步：');
	console.log('  1. nanospec new "任务名称"  创建任务目录');
	console.log('  2. 编辑 brief.md 描述需求');
	console.log('  3. 使用 /spec.1-spec 开始规格撰写');
	console.log('\n提示：');
	console.log('  - 内置模板位于 .iflow/commands/');
	console.log('  - 如需定制输出格式，可在 nanospec/templates/ 创建对应文件');
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

	// 只询问 AI 工具选择，其他配置项使用默认值
	const answers = await inquirer.prompt<Pick<InteractiveAnswers, 'adapters'>>([
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
	]);

	// 使用默认配置
	const defaultConfig = {
		specs_root: config.specs_root || 'nanospec',
		cmd_prefix: config.cmd_prefix || 'spec',
		default_adapter: answers.adapters[0] || 'cursor',
		template_format: 'md' as const,
		auto_sync: true,
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

	// 为每个选中的 AI 工具生成命令文件
	for (const adapterName of answers.adapters) {
		const adapter = getAdapter(adapterName);
		if (adapter) {
			adapter.generateCommands(cwd, __dirname);
			console.log(`✓ 创建 ${adapter.commandsDir} (9 个命令)`);
		}
	}

	console.log('\n🎉 nanospec 初始化完成！');
	console.log('\n配置信息（使用默认值）：');
	console.log(`  - 规格根目录: ${defaultConfig.specs_root}`);
	console.log(`  - 命令前缀: ${defaultConfig.cmd_prefix}`);
	console.log(`  - 默认 AI 工具: ${defaultConfig.default_adapter}`);
	console.log(`  - 支持的 AI 工具: ${answers.adapters.join(', ')}`);
	console.log('\n如需修改配置，可使用：');
	console.log('  - nanospec config set <key> <value>');
	console.log('  - nanospec config --list');
	console.log('\n下一步：');
	console.log('  1. nanospec new "任务名称"  创建任务目录');
	console.log('  2. 编辑 brief.md 描述需求');
	console.log('  3. 使用 /spec.1-spec 开始规格撰写');
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