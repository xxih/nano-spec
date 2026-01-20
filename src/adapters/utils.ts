import { existsSync, readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import type { CommandFormat } from './index.js';

/**
 * 获取命令模板内容
 * 优先级：内置模板 > 项目定制模板
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
  // 1. 优先从内置的 .iflow/commands/ 读取（内联模板）
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  const builtinCommandsDir = join(__dirname, '../../.iflow/commands');
  const builtinPath = join(builtinCommandsDir, `${commandName}.toml`);

  if (existsSync(builtinPath)) {
    return readFileSync(builtinPath, 'utf-8');
  }

  // 2. 尝试从项目定制的 templates/commands/ 读取
  const projectCommandsPath = join(templatesDir, 'commands', `${commandName}.toml`);
  if (existsSync(projectCommandsPath)) {
    return readFileSync(projectCommandsPath, 'utf-8');
  }

  // 3. 尝试读取 .md 格式的通用模板（向后兼容）
  const mdPath = join(templatesDir, 'commands', `${commandName}.md`);
  if (existsSync(mdPath)) {
    return readFileSync(mdPath, 'utf-8');
  }

  return null;
}

/**
 * 解析 TOML 格式的命令文件
 * 提取 name、description 和 prompt 字段
 *
 * @param content TOML 格式的命令内容
 * @param commandName 命令名称（如 flow.1-spec）
 * @returns 解析后的命令对象
 */
export function parseTomlCommand(content: string, commandName: string): {
  name: string;
  description: string;
  prompt: string;
} {
  const lines = content.split('\n');
  let description = '';
  let prompt = '';
  let inPrompt = false;
  const promptLines: string[] = [];

  for (const line of lines) {
    // 提取 description
    if (line.startsWith('description =')) {
      // 移除引号和等号，获取描述
      const match = line.match(/description\s*=\s*["'](.+?)["']/);
      if (match) {
        description = match[1];
      }
    }
    // 提取 prompt（多行字符串）
    else if (line.startsWith('prompt =')) {
      inPrompt = true;
      // 检查是否是多行字符串的开始
      if (line.includes('"""')) {
        // 多行字符串，从下一行开始读取
        continue;
      } else {
        // 单行字符串
        const match = line.match(/prompt\s*=\s*["'](.+?)["']/);
        if (match) {
          prompt = match[1];
        }
        inPrompt = false;
      }
    }
    // 读取多行 prompt 内容
    else if (inPrompt) {
      if (line.trim() === '"""') {
        // 多行字符串结束
        inPrompt = false;
      } else {
        promptLines.push(line);
      }
    }
  }

  prompt = promptLines.join('\n').trim();

  return {
    name: commandName,
    description: description || commandName,
    prompt: prompt || '',
  };
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