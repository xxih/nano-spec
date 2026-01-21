import { existsSync } from 'fs';
import { join } from 'path';
import inquirer from 'inquirer';
import { loadConfig } from '../config/config.js';
import { getCurrentTask, setCurrentTask, listTasks, getTaskStatus } from '../config/task-pointer.js';

/**
 * 切换当前任务
 * @param name 任务名称（可选）
 */
export async function switchTask(name?: string): Promise<void> {
	const cwd = process.cwd();
	const config = await loadConfig(cwd);
	const nanospecDir = join(cwd, config.specs_root || 'nanospec');

	// 检查 nanospec 目录是否存在
	if (!existsSync(nanospecDir)) {
		console.log('❌ 请先运行 nanospec init 初始化项目');
		return;
	}

	// 如果没有提供任务名称，使用交互式选择
	if (!name) {
		const currentTask = getCurrentTask(cwd);
		const tasks = await listTasks(cwd);

		if (tasks.length === 0) {
			console.log('📍 当前任务: 未设置');
			console.log('\n暂无任务，使用 nanospec new 创建任务');
			return;
		}

		// 使用交互式选择
		const result = await inquirer.prompt<{selectedTask: string}>([
			{
				type: 'list',
				name: 'selectedTask',
				message: '选择要切换的任务：',
				choices: tasks.map((task) => ({
					name: task === currentTask ? `${task} (当前)` : task,
					value: task,
				})),
			},
		]);

		if (!result.selectedTask) {
			console.log('❌ 未选择任务');
			return;
		}

		name = result.selectedTask;
	}

	// 检查任务是否存在
	const taskDir = join(nanospecDir, name);
	if (!existsSync(taskDir)) {
		console.log(`❌ 任务不存在: ${name}`);
		const tasks = await listTasks(cwd);
		if (tasks.length > 0) {
			console.log('\n可用任务:');
			for (const task of tasks) {
				console.log(`  - ${task}`);
			}
		}
		return;
	}

	// 设置当前任务
	if (name) {
		setCurrentTask(cwd, name);

		// 显示任务状态
		const status = await getTaskStatus(cwd, name);
		console.log(`✓ 已切换到任务: ${name}`);
		console.log('\n任务状态:');
		console.log(`  brief.md: ${status.hasBrief ? '✓' : '✗'}`);
		console.log(`  1-spec.md: ${status.hasSpec ? '✓' : '✗'}`);
		console.log(`  2-plan.md: ${status.hasPlan ? '✓' : '✗'}`);
		console.log(`  3-tasks.md: ${status.hasTasks ? '✓' : '✗'}`);
	}
}