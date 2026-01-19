import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';

export async function newTask(name?: string): Promise<void> {
  const cwd = process.cwd();
  const specflowDir = join(cwd, 'specflow');

  if (!existsSync(specflowDir)) {
    console.log('❌ 请先运行 specflow init 初始化项目');
    return;
  }

  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const taskName = name || '待命名';
  const dirName = `${date}-${taskName}`;
  const taskDir = join(specflowDir, dirName);

  if (existsSync(taskDir)) {
    console.log(`⚠️  目录已存在: ${dirName}`);
    return;
  }

  mkdirSync(join(taskDir, 'assets'), { recursive: true });
  mkdirSync(join(taskDir, 'outputs'), { recursive: true });

  writeFileSync(
    join(taskDir, 'brief.md'),
    `# ${taskName}\n\n<!-- 在此描述需求 -->\n`,
    'utf-8'
  );

  console.log(`✓ 创建任务目录: specflow/${dirName}/`);
  console.log('  ├── brief.md');
  console.log('  ├── assets/');
  console.log('  └── outputs/');
  console.log('\n下一步：编辑 brief.md 描述需求，然后使用 /flow.1-spec');
}