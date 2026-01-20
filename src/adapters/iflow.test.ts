import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { existsSync, mkdirSync, rmSync, readFileSync } from 'fs';
import { join } from 'path';
import { iflowAdapter } from './iflow.js';

describe('iflow adapter', () => {
  const testDir = join(process.cwd(), '.test-iflow-adapter');
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
    expect(iflowAdapter.name).toBe('iflow');
    expect(iflowAdapter.commandsDir).toBe('.iflow/commands/');
    expect(typeof iflowAdapter.generateCommands).toBe('function');
  });

  it('应该创建 .iflow/commands/ 目录', () => {
    iflowAdapter.generateCommands(testDir, templatesDir);

    const commandsDir = join(testDir, '.iflow', 'commands');
    expect(existsSync(commandsDir)).toBe(true);
  });

  it('应该生成 6 个 TOML 命令文件', () => {
    iflowAdapter.generateCommands(testDir, templatesDir);

    const commandsDir = join(testDir, '.iflow', 'commands');
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

  it('生成的 TOML 文件应该有内容', () => {
    iflowAdapter.generateCommands(testDir, templatesDir);

    const commandsDir = join(testDir, '.iflow', 'commands');
    const filePath = join(commandsDir, 'flow.1-spec.toml');

    if (existsSync(filePath)) {
      const content = readFileSync(filePath, 'utf-8');
      expect(content.length).toBeGreaterThan(0);
      // TOML 文件应该包含基本结构
      expect(content).toMatch(/\[/); // TOML section
    }
  });

  it('应该能够多次调用而不报错', () => {
    iflowAdapter.generateCommands(testDir, templatesDir);
    iflowAdapter.generateCommands(testDir, templatesDir);

    const commandsDir = join(testDir, '.iflow', 'commands');
    expect(existsSync(commandsDir)).toBe(true);
  });
});