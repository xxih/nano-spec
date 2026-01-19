import { cursorAdapter } from './cursor.js';
import { qwenAdapter } from './qwen.js';
import { iflowAdapter } from './iflow.js';
import { clineAdapter } from './cline.js';

export interface AIAdapter {
  name: string;
  commandsDir: string;
  generateCommands(cwd: string, templatesDir: string): void;
}

const adapters: Record<string, AIAdapter> = {
  cursor: cursorAdapter,
  qwen: qwenAdapter,
  iflow: iflowAdapter,
  cline: clineAdapter,
};

export function getAdapter(name: string): AIAdapter | null {
  return adapters[name] || null;
}

export function listAdapters(): string[] {
  return Object.keys(adapters);
}