import {existsSync, readFileSync, writeFileSync, mkdirSync, unlinkSync} from 'fs';
import {join} from 'path';
import {homedir} from 'os';

interface ConfigOptions {
	global?: boolean;
	list?: boolean;
}

interface NanospecConfig {
	specs_root?: string;
	cmd_prefix?: string;
	default_adapter?: string;
	template_format?: 'md' | 'toml' | 'json';
	auto_sync?: boolean;
}

const DEFAULT_CONFIG: NanospecConfig = {
	specs_root: 'nanospec',
	cmd_prefix: 'spec',
	default_adapter: 'cursor',
	template_format: 'md',
	auto_sync: true,
};

/**
 * 获取配置文件路径
 */
function getConfigPath(global: boolean = false): string {
	if (global) {
		return join(homedir(), '.nanospecrc');
	}
	return join(process.cwd(), '.nanospec', 'config.json');
}

/**
 * 读取配置
 */
function readConfig(configPath: string): NanospecConfig {
	if (!existsSync(configPath)) {
		return {};
	}

	try {
		const content = readFileSync(configPath, 'utf-8');
		return JSON.parse(content);
	} catch (error) {
		console.warn(`⚠️  无法读取配置文件: ${configPath}`);
		return {};
	}
}

/**
 * 写入配置
 */
function writeConfig(configPath: string, config: NanospecConfig): void {
	const dir = join(configPath, '..');
	if (!existsSync(dir)) {
		mkdirSync(dir, {recursive: true});
	}

	try {
		writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf-8');
	} catch (error) {
		console.error(`❌ 无法写入配置文件: ${configPath}`);
		throw error;
	}
}

/**
 * 显示当前配置
 */
export async function config(
	action?: 'get' | 'set' | 'unset',
	key?: string,
	value?: string,
	options: ConfigOptions = {}
): Promise<void> {
	const configPath = getConfigPath(options.global ?? false);
	const currentConfig = readConfig(configPath);

	// 如果指定了 list，列出所有配置项
	if (options.list) {
		listConfig(currentConfig, configPath, options.global ?? false);
		return;
	}

	// 如果指定了 get，获取配置值
	if (action === 'get' && key) {
		getConfig(currentConfig, key);
		return;
	}

	// 如果指定了 set，设置配置
	if (action === 'set' && key && value) {
		setConfig(configPath, currentConfig, key, value);
		return;
	}

	// 如果指定了 unset，删除配置
	if (action === 'unset' && key) {
		unsetConfig(configPath, currentConfig, key);
		return;
	}

	// 默认显示当前配置
	showCurrentConfig(currentConfig, configPath, options.global ?? false);
}

/**
 * 列出所有配置项
 */
function listConfig(config: NanospecConfig, configPath: string, global: boolean): void {
	console.log(`\n配置文件: ${configPath}`);
	console.log(`配置范围: ${global ? '全局（用户级）' : '项目级'}\n`);

	const mergedConfig = {...DEFAULT_CONFIG, ...config};

	console.log('配置项：');
	console.log(`  specs_root      = ${mergedConfig.specs_root}`);
	console.log(`  cmd_prefix      = ${mergedConfig.cmd_prefix}`);
	console.log(`  default_adapter = ${mergedConfig.default_adapter}`);
	console.log(`  template_format = ${mergedConfig.template_format}`);
	console.log(`  auto_sync       = ${mergedConfig.auto_sync ?? DEFAULT_CONFIG.auto_sync}`);
}

/**
 * 获取配置值
 */
function getConfig(config: NanospecConfig, key: string): void {
	const mergedConfig = {...DEFAULT_CONFIG, ...config};

	if (key in mergedConfig) {
		console.log(`${key} = ${mergedConfig[key as keyof NanospecConfig]}`);
	} else {
		console.log(`⚠️  配置项不存在: ${key}`);
		console.log(`\n可用配置项: ${Object.keys(DEFAULT_CONFIG).join(', ')}`);
	}
}

/**
 * 设置配置
 */
function setConfig(configPath: string, config: NanospecConfig, key: string, value: string): void {
	if (!(key in DEFAULT_CONFIG)) {
		console.log(`⚠️  无效的配置项: ${key}`);
		console.log(`\n可用配置项: ${Object.keys(DEFAULT_CONFIG).join(', ')}`);
		return;
	}

	// 尝试解析值
	let parsedValue: any = value;
	if (value === 'true') {
		parsedValue = true;
	} else if (value === 'false') {
		parsedValue = false;
	}

	config[key as keyof NanospecConfig] = parsedValue;
	writeConfig(configPath, config);

	console.log(`✓ 已设置: ${key} = ${parsedValue}`);
}

/**
 * 删除配置
 */
function unsetConfig(configPath: string, config: NanospecConfig, key: string): void {
	if (!(key in config)) {
		console.log(`⚠️  配置项不存在: ${key}`);
		return;
	}

	delete config[key as keyof NanospecConfig];

	// 如果配置为空，删除配置文件
	if (Object.keys(config).length === 0) {
		try {
			unlinkSync(configPath);
			console.log(`✓ 已删除配置文件: ${configPath}`);
		} catch (error) {
			console.warn(`⚠️  无法删除配置文件: ${configPath}`);
		}
	} else {
		writeConfig(configPath, config);
		console.log(`✓ 已删除: ${key}`);
	}
}

/**
 * 显示当前配置
 */
function showCurrentConfig(config: NanospecConfig, configPath: string, global: boolean): void {
	console.log(`\n配置文件: ${configPath}`);
	console.log(`配置范围: ${global ? '全局（用户级）' : '项目级'}\n`);

	if (Object.keys(config).length === 0) {
		console.log('使用默认配置：');
		console.log(`  specs_root      = ${DEFAULT_CONFIG.specs_root}`);
		console.log(`  cmd_prefix      = ${DEFAULT_CONFIG.cmd_prefix}`);
		console.log(`  default_adapter = ${DEFAULT_CONFIG.default_adapter}`);
		console.log(`  template_format = ${DEFAULT_CONFIG.template_format}`);
		console.log(`  auto_sync       = ${DEFAULT_CONFIG.auto_sync}`);
	} else {
		const mergedConfig = {...DEFAULT_CONFIG, ...config};

		console.log('当前配置：');
		console.log(`  specs_root      = ${mergedConfig.specs_root}${config.specs_root ? ' (自定义)' : ''}`);
		console.log(`  cmd_prefix      = ${mergedConfig.cmd_prefix}${config.cmd_prefix ? ' (自定义)' : ''}`);
		console.log(`  default_adapter = ${mergedConfig.default_adapter}${config.default_adapter ? ' (自定义)' : ''}`);
		console.log(`  template_format = ${mergedConfig.template_format}${config.template_format ? ' (自定义)' : ''}`);
		console.log(`  auto_sync       = ${mergedConfig.auto_sync ?? DEFAULT_CONFIG.auto_sync}${config.auto_sync !== undefined ? ' (自定义)' : ''}`);
	}
}
