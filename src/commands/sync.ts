import { getAdapter, listAdapters } from '../adapters/index.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = import.meta.dirname || (() => {
	const url = new URL('.', import.meta.url);
	return url.pathname;
})();

interface SyncOptions {
	adapter?: string;
	force?: boolean;
}

/**
 * 同步命令到 AI 工具
 * @param options 同步选项
 */
export async function syncCommands(options: SyncOptions = {}): Promise<void> {
	const cwd = process.cwd();
	const adapters = options.adapter ? [options.adapter] : listAdapters();

	console.log('开始同步命令...\n');

	for (const adapterName of adapters) {
		const adapter = getAdapter(adapterName);
		if (!adapter) {
			console.log(`⚠️  跳过不支持的适配器: ${adapterName}`);
			continue;
		}

		console.log(`同步到 ${adapter.name}...`);

		try {
			adapter.generateCommands(cwd, __dirname);
			console.log(`  ✓ 已更新 ${adapter.commandsDir}`);
		} catch (error) {
			console.log(`  ❌ 同步失败: ${error}`);
		}
	}

	console.log('\n✅ 命令同步完成！');
}