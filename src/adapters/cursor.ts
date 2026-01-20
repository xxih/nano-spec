import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';
import type { AIAdapter } from './index.js';
import { getCommandTemplate, getFileExtension } from './utils.js';

export const cursorAdapter: AIAdapter = {
  name: 'cursor',
  commandsDir: '.cursor/commands/',
  fileFormat: 'md',
  supportsVariables: false,

  generateCommands(cwd: string, templatesDir: string): void {
    const commandsDir = join(cwd, '.cursor', 'commands');
    mkdirSync(commandsDir, { recursive: true });

    const commands = [
      'flow.1-spec',
      'flow.2-plan',
      'flow.3-execute',
      'flow.accept',
      'flow.align',
      'flow.summary',
    ];

    for (const cmd of commands) {
      // 获取模板内容
      const template = getCommandTemplate(templatesDir, 'cursor', cmd);
      if (!template) {
        console.warn(`⚠️  模板不存在: ${cmd}`);
        continue;
      }

      // 转换格式（cursor 使用标准 Markdown 格式）
      const content = this.transformCommand?.(template, cmd) || template;

      // 写入文件
      const ext = getFileExtension(this.fileFormat);
      const dest = join(commandsDir, `${cmd}${ext}`);
      writeFileSync(dest, content, 'utf-8');
    }
  },

  transformCommand(content: string, commandName: string): string {
    // cursor 使用标准 Markdown 格式，直接返回
    // 如果需要特定的格式调整，可以在这里添加
    return content;
  },
};