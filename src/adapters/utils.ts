import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import type { CommandFormat } from './index.js';

/**
 * 获取命令模板内容
 * 优先级：特定适配器模板 > 通用模板
 *
 * @param templatesDir 模板根目录
 * @param adapterName 适配器名称
 * @param commandName 命令名称（如 flow.1-spec）
 * @returns 模板内容，如果不存在则返回 null
 */
export function getCommandTemplate(
  templatesDir: string,
  adapterName: string,
  commandName: string
): string | null {
  // 1. 尝试读取特定适配器模板
  const specificPath = join(templatesDir, 'adapters', adapterName, `${commandName}.toml`);
  if (existsSync(specificPath)) {
    return readFileSync(specificPath, 'utf-8');
  }

  // 2. 尝试读取通用模板（.base 文件）
  const basePath = join(templatesDir, 'commands', `${commandName}.md`);
  if (existsSync(basePath)) {
    return readFileSync(basePath, 'utf-8');
  }

  // 3. 尝试读取 .toml 格式的通用模板
  const tomlPath = join(templatesDir, 'commands', `${commandName}.toml`);
  if (existsSync(tomlPath)) {
    return readFileSync(tomlPath, 'utf-8');
  }

  return null;
}

/**
 * 解析 Markdown 命令模板，提取元数据和内容
 *
 * @param content Markdown 格式的命令内容
 * @returns 解析后的元数据和内容
 */
export function parseMarkdownCommand(content: string): {
  command: string;
  description: string;
  category: string;
  version: string;
  prompt: string;
} {
  const lines = content.split('\n');
  let command = '';
  let description = '';
  let category = 'specflow';
  let version = '1';
  let prompt = '';
  let inPrompt = false;

  for (const line of lines) {
    if (line.startsWith('# Command:')) {
      command = line.replace('# Command:', '').trim();
    } else if (line.startsWith('# Description:')) {
      description = line.replace('# Description:', '').trim();
    } else if (line.startsWith('# Category:')) {
      category = line.replace('# Category:', '').trim();
    } else if (line.startsWith('# Version:')) {
      version = line.replace('# Version:', '').trim();
    } else if (line.startsWith('prompt =')) {
      inPrompt = true;
      prompt += line + '\n';
    } else if (inPrompt) {
      prompt += line + '\n';
    }
  }

  return { command, description, category, version, prompt };
}

/**
 * 将 Markdown 命令转换为 TOML 格式
 *
 * @param content Markdown 格式的命令内容
 * @returns TOML 格式的命令内容
 */
export function markdownToToml(content: string): string {
  const { command, description, category, version, prompt } = parseMarkdownCommand(content);

  return `# Command: ${command}
# Description: ${description}
# Category: ${category}
# Version: ${version}

description = "${description}"

prompt = """${prompt}"""
`;
}

/**
 * 替换模板变量
 *
 * @param content 模板内容
 * @param variables 变量映射
 * @returns 替换后的内容
 */
export function replaceVariables(
  content: string,
  variables: Record<string, string>
): string {
  let result = content;
  for (const [key, value] of Object.entries(variables)) {
    result = result.replace(new RegExp(`{{${key}}}`, 'g'), value);
  }
  return result;
}

/**
 * 获取文件扩展名
 *
 * @param format 命令格式
 * @returns 文件扩展名
 */
export function getFileExtension(format: CommandFormat): string {
  const extensions: Record<CommandFormat, string> = {
    md: '.md',
    toml: '.toml',
    json: '.json',
    yaml: '.yaml',
  };
  return extensions[format] || '.md';
}