import { cursorAdapter } from './cursor.js';
import { qwenAdapter } from './qwen.js';
import { iflowAdapter } from './iflow.js';
import { clineAdapter } from './cline.js';
import { claudeCodeAdapter } from './claude-code.js';
import { copilotAdapter } from './copilot.js';
import { windsurfAdapter } from './windsurf.js';
import { kiloCodeAdapter } from './kilo-code.js';

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
  /** 命令文件目录（相对于项目根目录） */
  commandsDir: string;
  /** 命令文件格式 */
  fileFormat: CommandFormat;
  /** 是否支持变量替换 */
  supportsVariables: boolean;
  /** 生成命令文件 */
  generateCommands(cwd: string, templatesDir: string): void;
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
  qwen: qwenAdapter,
  iflow: iflowAdapter,
  cline: clineAdapter,
  'claude-code': claudeCodeAdapter,
  copilot: copilotAdapter,
  windsurf: windsurfAdapter,
  'kilo-code': kiloCodeAdapter,
};

export function getAdapter(name: string): AIAdapter | null {
  return adapters[name] || null;
}

export function listAdapters(): string[] {
  return Object.keys(adapters);
}