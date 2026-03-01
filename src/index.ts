#!/usr/bin/env node

import {Command} from 'commander';
import {createRequire} from 'node:module';
import {init} from './commands/init.js';
import {newTask} from './commands/new.js';
import {switchTask} from './commands/switch.js';
import {showStatus} from './commands/status.js';
import {listPresets, installPreset, uninstallPreset} from './commands/preset.js';
import {syncCommands} from './commands/sync.js';
import {config} from './commands/config.js';

const require = createRequire(import.meta.url);
const {version: packageVersion} = require('../package.json') as {version: string};

export function createProgram(): Command {
	const program = new Command();

	program
		.name('nanospec')
		.description('nanospec - Spec 驱动开发工作流')
		.version(packageVersion);

	program
		.command('init')
		.alias('i')
		.description('初始化 nanospec 项目结构')
		.option('--ai <tool>', 'AI 工具类型（非交互式快速初始化）')
		.option('--assets <mode>', '同步资产类型（commands|skills|both）')
		.option('--scope <scope>', '资产作用域（project|user）')
		.option('-f, --force', '强制覆盖已存在的文件')
		.action((options) => init(options));

	program
		.command('new [name]')
		.alias('n')
		.description('创建新的任务目录')
		.action((name) => newTask(name));

	program
		.command('switch [name]')
		.alias('s')
		.description('切换当前任务')
		.action((name) => switchTask(name));

	program
		.command('status')
		.alias('st')
		.description('显示当前状态')
		.action(() => showStatus());

	const presetCmd = program
		.command('preset')
		.alias('p')
		.description('预设包管理');

	presetCmd
		.command('list')
		.alias('ls')
		.description('列出所有可用预设')
		.action(() => listPresets());

	presetCmd
		.command('install [name]')
		.alias('add')
		.description('安装预设（不指定名称时使用交互式选择）')
		.action((name) => installPreset(name));

	presetCmd
		.command('uninstall <name>')
		.alias('rm')
		.description('卸载预设')
		.action((name) => uninstallPreset(name));

	program
		.command('sync')
		.alias('sy')
		.description('同步资产到 AI 工具')
		.option('--adapter <name>', '指定 AI 工具')
		.option('--assets <mode>', '同步资产类型（commands|skills|both）')
		.option('--scope <scope>', '资产作用域（project|user）')
		.action((options) => syncCommands(options));

	const configCmd = program
		.command('config')
		.alias('c')
		.description('配置管理');

	configCmd
		.command('get <key>')
		.alias('g')
		.description('获取配置值')
		.option('-g, --global', '操作全局配置')
		.action((key, options) => config('get', key, undefined, options));

	configCmd
		.command('set <key> <value>')
		.alias('s')
		.description('设置配置')
		.option('-g, --global', '操作全局配置')
		.action((key, value, options) => config('set', key, value, options));

	configCmd
		.command('unset <key>')
		.alias('u')
		.description('删除配置项')
		.option('-g, --global', '操作全局配置')
		.action((key, options) => config('unset', key, undefined, options));

	configCmd
		.command('list')
		.alias('ls')
		.description('列出所有配置项')
		.option('-g, --global', '操作全局配置')
		.action((options) => config(undefined, undefined, undefined, {...options, list: true}));

	configCmd
		.action((options) => config(undefined, undefined, undefined, options));

	return program;
}
