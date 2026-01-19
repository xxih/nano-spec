#!/usr/bin/env node

import { Command } from 'commander';
import { init } from './commands/init.js';
import { newTask } from './commands/new.js';

const program = new Command();

program
  .name('specflow')
  .description('SpecFlow - Spec 驱动开发工作流')
  .version('1.0.0');

program
  .command('init')
  .description('初始化 SpecFlow 项目结构')
  .option('--ai <tool>', 'AI 工具类型', 'cursor')
  .option('-f, --force', '强制覆盖已存在的文件')
  .action((options) => init(options));

program
  .command('new [name]')
  .description('创建新的任务目录')
  .action((name) => newTask(name));

program.parse();