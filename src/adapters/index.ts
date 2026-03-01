import { cursorAdapter } from './cursor.js';
import { codexAdapter } from './codex.js';
import { qwenAdapter } from './qwen.js';
import { iflowAdapter } from './iflow.js';
import { clineAdapter } from './cline.js';
import { claudeCodeAdapter } from './claude-code.js';
import { copilotAdapter } from './copilot.js';
import { windsurfAdapter } from './windsurf.js';
import { kiloCodeAdapter } from './kilo-code.js';
import { geminiAdapter } from './gemini.js';

export type AssetType = 'commands' | 'skills';
export type AdapterScope = 'project' | 'user';

export interface AdapterGenerateOptions {
  scope?: AdapterScope;
  skills?: string[];
}

/**
 * 支持的命令文件格式
 */
export type CommandFormat = 'md' | 'toml' | 'json' | 'yaml';

/**
 * AI 适配器接口
 * 为不同 AI 工具提供统一的命令生成接口，支持格式转换和内容定制
 */
export interface AIAdapter {
  /** AI 工具名称 */
  name: string;
  /** 支持的资产类型 */
  supportedAssets: AssetType[];
  /** 命令文件目录（相对于项目根目录） */
  commandsDir: string;
  /** 命令文件格式 */
  fileFormat: CommandFormat;
  /** 是否支持变量替换 */
  supportsVariables: boolean;
  /** 解析命令目标目录（支持 scope 的适配器可实现） */
  resolveCommandsDir?(cwd: string, options?: AdapterGenerateOptions): string;
  /** 解析 skills 目标目录（支持 skills 的适配器可实现） */
  resolveSkillsDir?(cwd: string, options?: AdapterGenerateOptions): string;
  /** 生成命令文件 */
  generateCommands(cwd: string, templatesDir: string, options?: AdapterGenerateOptions): void;
  /** 生成 skills（仅部分适配器支持） */
  generateSkills?(cwd: string, templatesDir: string, options?: AdapterGenerateOptions): void;
  /**
   * 格式转换：将通用 Markdown 模板转换为特定 AI 工具格式
   * @param content Markdown 格式的命令内容
   * @param commandName 命令名称（如 spec.1-spec）
   * @returns 转换后的内容
   */
  transformCommand?(content: string, commandName: string): string;
}

const adapters: Record<string, AIAdapter> = {
  cursor: cursorAdapter,
  codex: codexAdapter,
  qwen: qwenAdapter,
  iflow: iflowAdapter,
  cline: clineAdapter,
  'claude-code': claudeCodeAdapter,
  copilot: copilotAdapter,
  windsurf: windsurfAdapter,
  'kilo-code': kiloCodeAdapter,
  gemini: geminiAdapter,
};

export function getAdapter(name: string): AIAdapter | null {
  return adapters[name] || null;
}

export function listAdapters(): string[] {
  return Object.keys(adapters);
}
