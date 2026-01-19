import { existsSync, mkdirSync, cpSync } from 'fs';
import { join } from 'path';
import type { AIAdapter } from './index.js';

export const qwenAdapter: AIAdapter = {
  name: 'qwen',
  commandsDir: '.qwen/commands/',

  generateCommands(cwd: string, templatesDir: string): void {
    const commandsDir = join(cwd, '.qwen', 'commands');
    mkdirSync(commandsDir, { recursive: true });

    const commands = [
      'flow.1-spec.toml',
      'flow.2-plan.toml',
      'flow.3-execute.toml',
      'flow.accept.toml',
      'flow.align.toml',
      'flow.summary.toml',
    ];

    for (const cmd of commands) {
      const src = join(templatesDir, 'commands', cmd);
      const dest = join(commandsDir, cmd);
      if (existsSync(src)) {
        cpSync(src, dest);
      }
    }
  },
};