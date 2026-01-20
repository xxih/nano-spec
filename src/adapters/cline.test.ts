import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { existsSync, mkdirSync, rmSync, readFileSync } from 'fs';
import { join } from 'path';
import { clineAdapter } from './cline.js';

describe('cline adapter', () => {
  const testDir = join(process.cwd(), '.test-cline-adapter');
  const templatesDir = join(process.cwd(), 'src', 'templates');

  beforeEach(() => {
    // 清理测试目录
    if (existsSync(testDir)) {
      rmSync(testDir, { recursive: true, force: true });
    }
    mkdirSync(testDir, { recursive: true });

    // 模拟 process.cwd() 返回测试目录
    vi.spyOn(process, 'cwd').mockReturnValue(testDir);
  });

  afterEach(() => {
    // 清理测试目录
    if (existsSync(testDir)) {
      rmSync(testDir, { recursive: true, force: true });
    }
    vi.restoreAllMocks();
  });

  it('应该有正确的适配器属性', () => {
    expect(clineAdapter.name).toBe('cline');
    expect(clineAdapter.commandsDir).toBe('.cline/commands/');
    expect(typeof clineAdapter.generateCommands).toBe('function');
  });

  it('应该创建 .cline/commands/ 目录', () => {
    clineAdapter.generateCommands(testDir, templatesDir);

    const commandsDir = join(testDir, '.cline', 'commands');
    expect(existsSync(commandsDir)).toBe(true);
  });

  it('应该生成 6 个命令文件', () => {
    clineAdapter.generateCommands(testDir, templatesDir);

    const commandsDir = join(testDir, '.cline', 'commands');
    const expectedFiles = [
      'flow.1-spec.toml',
      'flow.2-plan.toml',
      'flow.3-execute.toml',
      'flow.accept.toml',
      'flow.align.toml',
      'flow.summary.toml',
    ];

    for (const file of expectedFiles) {
      expect(existsSync(join(commandsDir, file))).toBe(true);
    }
  });

  it('生成的命令文件应该有内容', () => {
    clineAdapter.generateCommands(testDir, templatesDir);

    const commandsDir = join(testDir, '.cline', 'commands');
    const filePath = join(commandsDir, 'flow.1-spec.toml');

    if (existsSync(filePath)) {
      const content = readFileSync(filePath, 'utf-8');
      expect(content.length).toBeGreaterThan(0);
    }
  });

  it('应该能够多次调用而不报错', () => {
    clineAdapter.generateCommands(testDir, templatesDir);
    clineAdapter.generateCommands(testDir, templatesDir);

    const commandsDir = join(testDir, '.cline', 'commands');
    expect(existsSync(commandsDir)).toBe(true);
  });
});