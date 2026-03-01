import {existsSync, mkdirSync, writeFileSync} from 'fs';
import {homedir} from 'os';
import { join } from 'path';
import type {AIAdapter, AdapterGenerateOptions} from './index.js';
import {
  getCommandTemplate,
  getFileExtension,
  parseTomlCommand,
  listAvailableCommands,
  listAvailableSkills,
  copySkillToDir,
} from './utils.js';

export const codexAdapter: AIAdapter = {
  name: 'codex',
  supportedAssets: ['commands', 'skills'],
  commandsDir: '.codex/prompts/',
  fileFormat: 'md',
  supportsVariables: true,

  generateCommands(cwd: string, templatesDir: string, options?: AdapterGenerateOptions): void {
    const codexRoot = resolveCodexRoot(cwd, options?.scope);
    const commandsDir = join(codexRoot, 'prompts');
    mkdirSync(commandsDir, { recursive: true });

    // 自动扫描所有可用的命令
    const commands = listAvailableCommands();

    for (const cmd of commands) {
      // 获取模板内容（TOML 格式）
      const template = getCommandTemplate(templatesDir, 'codex', cmd);
      if (!template) {
        console.warn(`⚠️  模板不存在: ${cmd}`);
        continue;
      }

      // 转换格式（从 TOML 转换为 Codex Markdown 格式）
      const content = this.transformCommand?.(template, cmd) || template;

      // 写入文件
      const ext = getFileExtension(this.fileFormat);
      const dest = join(commandsDir, `${cmd}${ext}`);
      writeFileSync(dest, content, 'utf-8');
    }
  },

  generateSkills(cwd: string, templatesDir: string, options?: AdapterGenerateOptions): void {
    const codexRoot = resolveCodexRoot(cwd, options?.scope);
    const skillsDir = join(codexRoot, 'skills');
    mkdirSync(skillsDir, {recursive: true});

    const availableSkills = listAvailableSkills();
    const selectedSkills =
      options?.skills && options.skills.length > 0
        ? availableSkills.filter((skill) => options.skills?.includes(skill))
        : availableSkills;

    for (const skillName of selectedSkills) {
      copySkillToDir(skillName, skillsDir);
    }
  },

  transformCommand(content: string, commandName: string): string {
    const parsed = parseTomlCommand(content, commandName);

    const lines: string[] = [];
    lines.push('---');
    lines.push(`name: ${parsed.name}`);
    lines.push(`description: ${parsed.description}`);
    lines.push('---');
    lines.push('');
    lines.push(parsed.prompt);

    return lines.join('\n');
  }
};

function resolveCodexRoot(cwd: string, scope?: 'project' | 'user'): string {
  if (scope === 'user') {
    const homeDir = process.env.NANOSPEC_HOME_DIR || homedir();
    return join(homeDir, '.codex');
  }

  return join(cwd, '.codex');
}
