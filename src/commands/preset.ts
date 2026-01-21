import { existsSync, readFileSync, readdirSync, cpSync, mkdirSync, appendFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { loadConfig } from '../config/config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 获取预设目录路径（支持开发和生产环境）
function getPresetsDir(): string {
	// 在开发环境中，预设目录在 src/presets
	// 在生产环境中，预设目录在 dist/presets
	const devPresetsDir = join(__dirname, '../../../presets');
	const prodPresetsDir = join(__dirname, '../presets');

	// 优先检查生产环境目录
	try {
		if (existsSync(prodPresetsDir)) {
			return prodPresetsDir;
		}
	} catch (e) {
		// 忽略错误，继续检查开发环境
	}

	// 回退到开发环境目录
	return devPresetsDir;
}

/**
 * 内置预设元数据
 */
interface PresetMetadata {
	name: string;
	version: string;
	description: string;
	commands?: string[];
	templates?: string[];
	extends?: string;
}

/**
 * 列出所有可用预设
 */
export async function listPresets(): Promise<void> {
	const presetsDir = getPresetsDir();

	if (!existsSync(presetsDir)) {
		console.log('⚠️  预设目录不存在');
		return;
	}

	const entries = readdirSync(presetsDir, { withFileTypes: true });
	const presets = entries.filter(entry => entry.isDirectory()).map(entry => entry.name);

	if (presets.length === 0) {
		console.log('暂无可用预设');
		return;
	}

	console.log('可用预设:');
	for (const preset of presets) {
		const metadata = getPresetMetadata(preset);
		if (metadata) {
			console.log(`  - ${preset}: ${metadata.description}`);
		} else {
			console.log(`  - ${preset}`);
		}
	}
}

/**
 * 安装预设
 * @param name 预设名称
 */
export async function installPreset(name: string): Promise<void> {
	const cwd = process.cwd();
	const config = await loadConfig(cwd);
	const presetsDir = getPresetsDir();
	const presetDir = join(presetsDir, name);

	// 检查预设是否存在
	if (!existsSync(presetDir)) {
		console.log(`❌ 预设不存在: ${name}`);
		await listPresets();
		return;
	}

	// 读取预设元数据
	const metadata = getPresetMetadata(name);
	if (!metadata) {
		console.log(`❌ 无法读取预设元数据: ${name}`);
		return;
	}

	const nanospecDir = join(cwd, config.specs_root || 'nanospec');
	const templatesDir = join(nanospecDir, 'templates');

	console.log(`正在安装预设: ${name}...`);

	// 1. 复制命令文件
	if (metadata.commands && metadata.commands.length > 0) {
		const commandsDir = join(cwd, '.iflow', 'commands');
		mkdirSync(commandsDir, { recursive: true });

		for (const cmd of metadata.commands) {
			const src = join(presetDir, 'commands', cmd);
			const ext = cmd.includes('.') ? '' : '.md';
			const dest = join(commandsDir, `${cmd}${ext}`);

			if (existsSync(src)) {
				cpSync(src, dest);
				console.log(`  ✓ 命令: ${cmd}`);
			} else {
				console.log(`  ⚠️  命令不存在: ${cmd}`);
			}
		}
	}

	// 2. 复制模板文件
	if (metadata.templates && metadata.templates.length > 0) {
		mkdirSync(templatesDir, { recursive: true });

		for (const tmpl of metadata.templates) {
			const src = join(presetDir, 'templates', tmpl);
			const ext = tmpl.includes('.') ? '' : '.md';
			const dest = join(templatesDir, `${tmpl}${ext}`);

			if (existsSync(src)) {
				cpSync(src, dest);
				console.log(`  ✓ 模板: ${tmpl}`);
			} else {
				console.log(`  ⚠️  模板不存在: ${tmpl}`);
			}
		}
	}

	// 3. 追加到 AGENTS.md
	if (metadata.extends) {
		const extendsFile = join(presetDir, metadata.extends);
		if (existsSync(extendsFile)) {
			const agentsFile = join(nanospecDir, 'AGENTS.md');
			const content = readFileSync(extendsFile, 'utf-8');
			appendFileSync(agentsFile, `\n\n${content}\n`);
			console.log(`  ✓ 扩展: ${metadata.extends}`);
		} else {
			console.log(`  ⚠️  扩展文件不存在: ${metadata.extends}`);
		}
	}

	console.log(`\n🎉 预设 ${name} 安装完成！`);
}

/**
 * 卸载预设
 * @param name 预设名称
 */
export async function uninstallPreset(name: string): Promise<void> {
	const cwd = process.cwd();
	const config = await loadConfig(cwd);
	const presetsDir = getPresetsDir();
	const presetDir = join(presetsDir, name);

	// 检查预设是否存在
	if (!existsSync(presetDir)) {
		console.log(`❌ 预设不存在: ${name}`);
		return;
	}

	// 读取预设元数据
	const metadata = getPresetMetadata(name);
	if (!metadata) {
		console.log(`❌ 无法读取预设元数据: ${name}`);
		return;
	}

	console.log(`⚠️  卸载预设需要手动删除以下文件:`);

	// 1. 列出命令文件
	if (metadata.commands && metadata.commands.length > 0) {
		const commandsDir = join(cwd, '.iflow', 'commands');
		for (const cmd of metadata.commands) {
			const ext = cmd.includes('.') ? '' : '.md';
			const dest = join(commandsDir, `${cmd}${ext}`);
			if (existsSync(dest)) {
				console.log(`  - 命令: ${dest}`);
			}
		}
	}

	// 2. 列出模板文件
	if (metadata.templates && metadata.templates.length > 0) {
		const templatesDir = join(cwd, config.specs_root || 'nanospec', 'templates');
		for (const tmpl of metadata.templates) {
			const ext = tmpl.includes('.') ? '' : '.md';
			const dest = join(templatesDir, `${tmpl}${ext}`);
			if (existsSync(dest)) {
				console.log(`  - 模板: ${dest}`);
			}
		}
	}

	// 3. 提示 AGENTS.md 需要手动编辑
	if (metadata.extends) {
		const agentsFile = join(cwd, config.specs_root || 'nanospec', 'AGENTS.md');
		console.log(`  - 扩展: 请手动编辑 ${agentsFile} 删除预设添加的内容`);
	}

	console.log('\n提示: 预设卸载需要手动删除上述文件，请谨慎操作。');
}

/**
 * 获取预设元数据
 */
function getPresetMetadata(name: string): PresetMetadata | null {
	const presetsDir = getPresetsDir();
	const presetDir = join(presetsDir, name);
	const metadataFile = join(presetDir, 'preset.json');

	if (!existsSync(metadataFile)) {
		return null;
	}

	try {
		const content = readFileSync(metadataFile, 'utf-8');
		return JSON.parse(content);
	} catch (error) {
		return null;
	}
}
