import {existsSync, mkdirSync, writeFileSync} from 'fs';
import {join} from 'path';
import inquirer from 'inquirer';
import {loadConfig} from '../config/config.js';
import {setCurrentTask} from '../config/task-pointer.js';

const ASSETS_README = `# Assets 目录说明

这里放支撑当前任务推进的补充材料。

简单任务：直接把截图、接口样例、日志、链接等平铺放在 \`assets/\` 下即可。
复杂任务：只有当材料明显变多、类型混杂时，再按需拆子目录，不要求一次性建全。

推荐子目录：
- \`research/\`：调研记录、竞品资料、方案比较、外部链接摘录
- \`bugs/\`：复现步骤、报错日志、截图、录屏、环境信息
- \`api/\`：接口文档、OpenAPI 片段、请求/响应样例、字段映射
- \`data/\`：测试数据、SQL、CSV、mock 数据
- \`ui/\`：线框图、视觉稿、交互截图
- \`references/\`：规范、会议纪要、上下游约束

保持“够用就建”，不必为了完整性预建所有目录。
`;

export async function newTask(name?: string): Promise<void> {
	const cwd = process.cwd();
	const config = await loadConfig(cwd);
	const nanospecDir = join(cwd, config.specs_root || 'nanospec');

	if (!existsSync(nanospecDir)) {
		console.log('❌ 请先运行 nanospec init 初始化项目');
		return;
	}

	const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
	let taskName = name?.trim();

	if (!taskName) {
		const result = await inquirer.prompt<{taskName: string}>([
			{
				type: 'input',
				name: 'taskName',
				message: '任务名称：',
				default: '待命名',
			},
		]);
		taskName = result.taskName?.trim() || '待命名';
	}

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
	writeFileSync(join(taskDir, 'assets', 'README.md'), ASSETS_README, 'utf-8');

	// 自动将新任务设为当前任务
	setCurrentTask(cwd, dirName);

	console.log(`✓ 创建任务目录: ${config.specs_root || 'nanospec'}/${dirName}/`);
	console.log('  ├── brief.md');
	console.log('  ├── assets/');
	console.log('  └── outputs/');
	console.log(`✓ 设置当前任务: ${dirName}`);
	console.log('\n下一步：编辑 brief.md 描述需求，然后使用 /spec.1-spec');
}
