import {existsSync, mkdirSync, writeFileSync} from 'fs';
import {join} from 'path';
import {loadConfig} from '../config/config.js';
import {setCurrentTask} from '../config/task-pointer.js';

export async function newTask(name?: string): Promise<void> {
	const cwd = process.cwd();
	const config = await loadConfig(cwd);
	const nanospecDir = join(cwd, config.specs_root || 'nanospec');

	if (!existsSync(nanospecDir)) {
		console.log('❌ 请先运行 nanospec init 初始化项目');
		return;
	}

	const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
	const taskName = name || '待命名';
	const dirName = `${date}-${taskName}`;
	const taskDir = join(nanospecDir, dirName);

	if (existsSync(taskDir)) {
		console.log(`⚠️  目录已存在: ${dirName}`);
		return;
	}

	mkdirSync(join(taskDir, 'assets'), {recursive: true});
	mkdirSync(join(taskDir, 'outputs'), {recursive: true});

	writeFileSync(
		join(taskDir, 'brief.md'),
		`# ${taskName}\n\n<!-- 在此描述需求 -->\n`,
		'utf-8'
	);

	// 自动将新任务设为当前任务
	setCurrentTask(cwd, dirName);

	console.log(`✓ 创建任务目录: ${config.specs_root || 'nanospec'}/${dirName}/`);
	console.log('  ├── brief.md');
	console.log('  ├── assets/');
	console.log('  └── outputs/');
	console.log(`✓ 设置当前任务: ${dirName}`);
	console.log('\n下一步：编辑 brief.md 描述需求，然后使用 /spec.1-spec');
}
