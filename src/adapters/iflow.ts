import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';
import type { AIAdapter } from './index.js';
import { getCommandTemplate, getFileExtension } from './utils.js';

export const iflowAdapter: AIAdapter = {
  name: 'iflow',
  commandsDir: '.iflow/commands/',
  fileFormat: 'toml',
  supportsVariables: false,

  generateCommands(cwd: string, templatesDir: string): void {
    const commandsDir = join(cwd, '.iflow', 'commands');
    mkdirSync(commandsDir, { recursive: true });

    const commands = [
      'spec.1-spec',
      'spec.2-plan',
      'spec.3-execute',
      'spec.accept',
      'spec.align',
      'spec.summary',
    ];

    for (const cmd of commands) {
      // 获取模板内容（TOML 格式）
      const template = getCommandTemplate(templatesDir, 'iflow', cmd);
      if (!template) {
        console.warn(`⚠️  模板不存在: ${cmd}`);
        continue;
      }

      // iflow 使用 TOML 格式，直接返回原始内容
      const content = this.transformCommand?.(template, cmd) || template;

      // 写入文件
      const ext = getFileExtension(this.fileFormat);
      const dest = join(commandsDir, `${cmd}${ext}`);
      writeFileSync(dest, content, 'utf-8');
    }
  },

  transformCommand(content: string, commandName: string): string {
    // iflow 使用 TOML 格式，直接返回原始内容
    return content;
  },
};