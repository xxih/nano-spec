import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';
import type { AIAdapter } from './index.js';
import { getCommandTemplate, getFileExtension, parseTomlCommand, listAvailableCommands } from './utils.js';

export const copilotAdapter: AIAdapter = {
  name: 'copilot',
  commandsDir: '.github/copilot/commands/',
  fileFormat: 'md',
  supportsVariables: true,

  generateCommands(cwd: string, templatesDir: string): void {
    const commandsDir = join(cwd, '.github', 'copilot', 'commands');
    mkdirSync(commandsDir, { recursive: true });

    // 自动扫描所有可用的命令
    const commands = listAvailableCommands();

    for (const cmd of commands) {
      // 获取模板内容（TOML 格式）
      const template = getCommandTemplate(templatesDir, 'copilot', cmd);
      if (!template) {
        console.warn(`⚠️  模板不存在: ${cmd}`);
        continue;
      }

      // 转换格式（从 TOML 转换为 GitHub Copilot Markdown 格式）
      const content = this.transformCommand?.(template, cmd) || template;

      // 写入文件
      const ext = getFileExtension(this.fileFormat);
      const dest = join(commandsDir, `${cmd}${ext}`);
      writeFileSync(dest, content, 'utf-8');
    }
  },

  transformCommand(content: string, commandName: string): string {
    // 解析 TOML 格式的命令
    const parsed = parseTomlCommand(content, commandName);

    // 生成 GitHub Copilot 支持的 Markdown 格式
    // GitHub Copilot Chat 的命令格式：使用 YAML frontmatter + prompt
    const lines: string[] = [];

    // 添加 YAML frontmatter
    lines.push('---');
    lines.push(`name: ${parsed.name}`);
    lines.push(`description: ${parsed.description}`);
    lines.push('---');
    lines.push('');

    // 添加 prompt 内容（Copilot 支持变量替换）
    let prompt = parsed.prompt;
    // 替换变量占位符（如 {{specs_root}}）
    prompt = prompt.replace(/{{specs_root}}/g, 'nanospec');
    prompt = prompt.replace(/{{cmd_prefix}}/g, 'spec');

    lines.push(prompt);

    return lines.join('\n');
  },
};