import { existsSync, mkdirSync, cpSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { getAdapter, listAdapters } from '../adapters/index.js';

interface InitOptions {
  ai: string;
  force?: boolean;
}

export async function init(options: InitOptions): Promise<void> {
  const cwd = process.cwd();
  const specflowDir = join(cwd, 'specflow');
  const templatesDir = join(specflowDir, 'templates');

  if (existsSync(specflowDir) && !options.force) {
    console.log('⚠️  specflow/ 目录已存在，使用 --force 强制覆盖');
    return;
  }

  const adapter = getAdapter(options.ai);
  if (!adapter) {
    console.log(`❌ 不支持的 AI 工具: ${options.ai}`);
    console.log(`   支持: ${listAdapters().join(', ')}`);
    return;
  }

  // 创建 specflow 目录结构
  mkdirSync(specflowDir, { recursive: true });

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);

  // 复制 AGENTS.md（从项目根目录查找）
  const agentsSrc = join(__dirname, '../../AGENTS.md');
  const agentsFallback = join(cwd, 'specflow', 'AGENTS.md');
  const agentsSource = existsSync(agentsSrc) ? agentsSrc : agentsFallback;

  if (existsSync(agentsSource)) {
    copyFile(agentsSource, join(specflowDir, 'AGENTS.md'));
    console.log('✓ 创建 specflow/AGENTS.md');
  } else {
    console.warn('⚠️  未找到 AGENTS.md，跳过复制');
  }

  // 生成 AI 工具的命令文件（使用内置的 .iflow/commands/ 模板）
  adapter.generateCommands(cwd, __dirname);
  console.log(`✓ 创建 ${adapter.commandsDir} (6 个命令)`);

  console.log('\n🎉 SpecFlow 初始化完成！');
  console.log('\n下一步：');
  console.log('  1. specflow new "任务名称"  创建任务目录');
  console.log('  2. 编辑 brief.md 描述需求');
  console.log('  3. 使用 /spec.1-spec 开始规格撰写');
  console.log('\n提示：');
  console.log('  - 内置模板位于 .iflow/commands/');
  console.log('  - 如需定制输出格式，可在 specflow/templates/ 创建对应文件');
}

function copyFile(src: string, dest: string): void {
  const dir = dirname(dest);
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
  if (existsSync(src)) {
    cpSync(src, dest);
  }
}