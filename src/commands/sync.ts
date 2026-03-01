import {fileURLToPath} from 'url';
import {dirname, join} from 'path';
import {getAdapter, listAdapters} from '../adapters/index.js';
import {listAvailableCommands, listAvailableSkills} from '../adapters/utils.js';
import {loadConfig} from '../config/config.js';

type AssetMode = 'commands' | 'skills' | 'both';
type AssetScope = 'project' | 'user';

const __filename = fileURLToPath(import.meta.url);
// sync.ts 位于 src/commands/，需要获取 src/ 目录作为 templatesDir
const __dirname = dirname(dirname(__filename));

interface SyncOptions {
	adapter?: string;
	force?: boolean;
	assets?: string;
	scope?: string;
}

/**
 * 同步资产到 AI 工具
 * @param options 同步选项
 */
export async function syncCommands(options: SyncOptions = {}): Promise<void> {
	const cwd = process.cwd();
	const config = await loadConfig(cwd);
	const adapters = options.adapter ? [options.adapter] : listAdapters();
	const assetMode = resolveAssetMode(options.assets, config.default_assets || 'commands');
	const scope = resolveAssetScope(options.scope, config.codex_scope || 'user');

	console.log(`开始同步资产（${assetMode}）...\n`);

	for (const adapterName of adapters) {
		const adapter = getAdapter(adapterName);
		if (!adapter) {
			console.log(`⚠️  跳过不支持的适配器: ${adapterName}`);
			continue;
		}

		console.log(`同步到 ${adapter.name}...`);

		try {
			if (supportsCommands(assetMode)) {
				adapter.generateCommands(cwd, __dirname, {scope});
				const targetDir = adapter.resolveCommandsDir?.(cwd, {scope}) || join(cwd, adapter.commandsDir);
				console.log(`  ✓ 已更新 ${targetDir} (${listAvailableCommands().length} 个命令)`);
			}

			if (supportsSkills(assetMode)) {
				if (adapter.generateSkills) {
					const availableSkills = listAvailableSkills();
					const selectedSkills =
						config.enabled_skills && config.enabled_skills.length > 0
							? availableSkills.filter((skill) =>
								config.enabled_skills?.includes(skill))
							: availableSkills;
					adapter.generateSkills(cwd, __dirname, {
						scope,
						skills: config.enabled_skills,
					});
					const targetDir = adapter.resolveSkillsDir?.(cwd, {scope}) || join(cwd, '.skills');
					console.log(`  ✓ 已更新 ${targetDir} (${selectedSkills.length} 个 skills)`);
				} else {
					console.log(`  ⚠️  ${adapter.name} 暂不支持 skills，已跳过`);
				}
			}
		} catch (error) {
			console.log(`  ❌ 同步失败: ${error}`);
		}
	}

	console.log('\n✅ 资产同步完成！');
}

function resolveAssetMode(input: string | undefined, fallback: AssetMode): AssetMode {
	if (input === 'commands' || input === 'skills' || input === 'both') {
		return input;
	}
	return fallback;
}

function resolveAssetScope(input: string | undefined, fallback: AssetScope): AssetScope {
	if (input === 'project' || input === 'user') {
		return input;
	}
	return fallback;
}

function supportsCommands(mode: AssetMode): boolean {
	return mode === 'commands' || mode === 'both';
}

function supportsSkills(mode: AssetMode): boolean {
	return mode === 'skills' || mode === 'both';
}
