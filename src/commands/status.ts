import { existsSync } from 'fs';
import { join } from 'path';
import { loadConfig } from '../config/config.js';
import { getCurrentTask, listTasks, getTaskStatus } from '../config/task-pointer.js';

/**
 * 显示当前状态
 */
export async function showStatus(): Promise<void> {
	const cwd = process.cwd();
	const config = await loadConfig(cwd);
	const nanospecDir = join(cwd, config.specs_root || 'nanospec');

	// 检查 nanospec 目录是否存在
	if (!existsSync(nanospecDir)) {
		console.log('❌ 请先运行 nanospec init 初始化项目');
		return;
	}

	// 显示配置信息
	console.log('📋 nanospec 配置');
	console.log(`  规格根目录: ${config.specs_root || 'nanospec'}`);
	console.log(`  命令前缀: ${config.cmd_prefix || 'spec'}`);
	console.log(`  默认工具: ${config.default_adapter || 'cursor'}`);
	console.log(`  模板格式: ${config.template_format || 'md'}`);
	console.log('');

	// 显示当前任务
	const currentTask = getCurrentTask(cwd);
	if (currentTask) {
		console.log('📍 当前任务');
		const taskDir = join(nanospecDir, currentTask);
		console.log(`  名称: ${currentTask}`);
		console.log(`  路径: ${taskDir}`);

		// 显示任务状态
		const status = await getTaskStatus(cwd, currentTask);
		console.log('\n  任务进度:');
		console.log(`    brief.md: ${status.hasBrief ? '✓' : '✗'}`);
		console.log(`    1-spec.md: ${status.hasSpec ? '✓' : '✗'}`);
		console.log(`    2-plan.md: ${status.hasPlan ? '✓' : '✗'}`);
		console.log(`    3-tasks.md: ${status.hasTasks ? '✓' : '✗'}`);
		console.log('');
	} else {
		console.log('📍 当前任务: 未设置');
		console.log('  使用 nanospec switch <任务名称> 切换任务');
		console.log('');
	}

	// 显示所有任务
	const tasks = await listTasks(cwd);
	if (tasks.length > 0) {
		console.log('📁 所有任务');
		for (const task of tasks) {
			const prefix = task === currentTask ? '→ ' : '  ';
			const status = await getTaskStatus(cwd, task);
			const progress = [status.hasBrief, status.hasSpec, status.hasPlan, status.hasTasks].filter(Boolean).length;
			const total = 4;
			console.log(`  ${prefix}${task} (${progress}/${total})`);
		}
		console.log('');
	} else {
		console.log('📁 暂无任务');
		console.log('  使用 nanospec new 创建任务');
		console.log('');
	}
}