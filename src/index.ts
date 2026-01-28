#!/usr/bin/env node

import {Command} from 'commander';
import {init} from './commands/init.js';
import {newTask} from './commands/new.js';
import {switchTask} from './commands/switch.js';
import {showStatus} from './commands/status.js';
import {listPresets, installPreset, uninstallPreset} from './commands/preset.js';
import {syncCommands} from './commands/sync.js';
import {config} from './commands/config.js';

const program = new Command();

program
	.name('nanospec')
	.description('nanospec - Spec 驱动开发工作流')
	.version('1.0.0');

program
	.command('init')
	.description('初始化 nanospec 项目结构')
	.option('--ai <tool>', 'AI 工具类型（非交互式快速初始化）')
	.option('-f, --force', '强制覆盖已存在的文件')
	.action((options) => init(options));

program
	.command('new [name]')
	.description('创建新的任务目录')
	.action((name) => newTask(name));

program
	.command('switch [name]')
	.description('切换当前任务')
	.action((name) => switchTask(name));

program
	.command('status')
	.description('显示当前状态')
	.action(() => showStatus());

const presetCmd = program
	.command('preset')
	.description('预设包管理');

presetCmd
	.command('list')
	.description('列出所有可用预设')
	.action(() => listPresets());

presetCmd
	.command('install [name]')
	.description('安装预设（不指定名称时使用交互式选择）')
	.action((name) => installPreset(name));

presetCmd
	.command('uninstall <name>')
	.description('卸载预设')
	.action((name) => uninstallPreset(name));

program
	.command('sync')
	.description('同步命令到 AI 工具')
	.option('--adapter <name>', '指定 AI 工具')
	.action((options) => syncCommands(options));

const configCmd = program
	.command('config')
	.description('配置管理');

configCmd
	.command('get <key>')
	.description('获取配置值')
	.option('-g, --global', '操作全局配置')
	.action((key, options) => config('get', key, undefined, options));

configCmd
	.command('set <key> <value>')
	.description('设置配置')
	.option('-g, --global', '操作全局配置')
	.action((key, value, options) => config('set', key, value, options));

configCmd
	.command('unset <key>')
	.description('删除配置项')
	.option('-g, --global', '操作全局配置')
	.action((key, options) => config('unset', key, undefined, options));

configCmd
	.command('list')
	.description('列出所有配置项')
	.option('-g, --global', '操作全局配置')
	.action((options) => config(undefined, undefined, undefined, {...options, list: true}));

configCmd
	.action((options) => config(undefined, undefined, undefined, options));

program.parse();
