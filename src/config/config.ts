import { existsSync, readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { homedir } from 'os';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * nanospec 配置接口
 */
export interface NanospecConfig {
	/** 规格根目录名（默认：nanospec） */
	specs_root?: string;
	/** 命令前缀（默认：spec） */
	cmd_prefix?: string;
	/** 默认 AI 工具（默认：cursor） */
	default_adapter?: string;
	/** 模板格式（默认：md） */
	template_format?: 'md' | 'toml' | 'json';
	/** init 时自动同步（默认：true） */
	auto_sync?: boolean;
}

/**
 * 默认配置
 */
export const DEFAULT_CONFIG: NanospecConfig = {
	specs_root: 'nanospec',
	cmd_prefix: 'spec',
	default_adapter: 'cursor',
	template_format: 'md',
	auto_sync: true,
};

/**
 * 加载配置文件
 * 优先级：项目级 > 用户级 > 默认
 */
export async function loadConfig(cwd: string = process.cwd()): Promise<NanospecConfig> {
	const config: NanospecConfig = { ...DEFAULT_CONFIG };

	// 1. 加载用户级配置 (~/.nanospecrc)
	const userConfigPath = join(homedir(), '.nanospecrc');
	if (existsSync(userConfigPath)) {
		try {
			const userConfig = parseConfigFile(userConfigPath);
			Object.assign(config, userConfig);
		} catch (error) {
			console.warn(`⚠️  无法加载用户配置: ${userConfigPath}`);
		}
	}

	// 2. 加载项目级配置 (.nanospecrc 或 nanospec.config.js)
	const projectConfigPath = join(cwd, '.nanospecrc');
	const projectConfigJsPath = join(cwd, 'nanospec.config.js');

	if (existsSync(projectConfigPath)) {
		try {
			const projectConfig = parseConfigFile(projectConfigPath);
			Object.assign(config, projectConfig);
		} catch (error) {
			console.warn(`⚠️  无法加载项目配置: ${projectConfigPath}`);
		}
	} else if (existsSync(projectConfigJsPath)) {
		try {
			// 动态导入 JS 配置文件
			const projectConfigModule = await import(projectConfigJsPath);
			const projectConfig = projectConfigModule.default || projectConfigModule;
			Object.assign(config, projectConfig);
		} catch (error) {
			console.warn(`⚠️  无法加载项目配置: ${projectConfigJsPath}`);
		}
	}

	// 3. 验证配置
	validateConfig(config);

	return config;
}

/**
 * 解析配置文件
 */
function parseConfigFile(filePath: string): NanospecConfig {
	const content = readFileSync(filePath, 'utf-8');
	const ext = filePath.split('.').pop();

	if (ext === 'json') {
		return JSON.parse(content);
	} else if (ext === 'toml') {
		// 简单的 TOML 解析（仅支持 key = value 格式）
		const config: any = {};
		const lines = content.split('\n');
		for (const line of lines) {
			const trimmed = line.trim();
			if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
				const [key, ...valueParts] = trimmed.split('=');
				const value = valueParts.join('=').trim();
				config[key.trim()] = parseValue(value);
			}
		}
		return config;
	} else {
		// 默认尝试 JSON 解析
		return JSON.parse(content);
	}
}

/**
 * 解析 TOML 值
 */
function parseValue(value: string): any {
	value = value.trim();

	// 字符串
	if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
		return value.slice(1, -1);
	}

	// 布尔值
	if (value === 'true') return true;
	if (value === 'false') return false;

	// 数字
	if (!isNaN(Number(value))) {
		return Number(value);
	}

	return value;
}

/**
 * 验证配置
 */
function validateConfig(config: NanospecConfig): void {
	const validAdapters = ['cursor', 'qwen', 'iflow', 'cline'];

	if (config.default_adapter && !validAdapters.includes(config.default_adapter)) {
		console.warn(`⚠️  无效的 default_adapter: ${config.default_adapter}`);
		console.warn(`   有效值: ${validAdapters.join(', ')}`);
		config.default_adapter = DEFAULT_CONFIG.default_adapter;
	}

	if (config.template_format && !['md', 'toml', 'json'].includes(config.template_format)) {
		console.warn(`⚠️  无效的 template_format: ${config.template_format}`);
		config.template_format = DEFAULT_CONFIG.template_format;
	}
}

/**
 * 获取默认配置
 */
export function getDefaultConfig(): NanospecConfig {
	return { ...DEFAULT_CONFIG };
}