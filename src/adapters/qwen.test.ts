import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { existsSync, mkdirSync, rmSync, readFileSync } from 'fs';
import { join } from 'path';
import { qwenAdapter } from './qwen.js';

describe('qwen adapter', () => {
  const testDir = join(process.cwd(), '.test-qwen-adapter');
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
    expect(qwenAdapter.name).toBe('qwen');
    expect(qwenAdapter.commandsDir).toBe('.qwen/commands/');
    expect(typeof qwenAdapter.generateCommands).toBe('function');
  });

  it('应该创建 .qwen/commands/ 目录', () => {
    qwenAdapter.generateCommands(testDir, templatesDir);

    const commandsDir = join(testDir, '.qwen', 'commands');
    expect(existsSync(commandsDir)).toBe(true);
  });

  it('应该生成 6 个命令文件', () => {
    qwenAdapter.generateCommands(testDir, templatesDir);

    const commandsDir = join(testDir, '.qwen', 'commands');
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
    qwenAdapter.generateCommands(testDir, templatesDir);

    const commandsDir = join(testDir, '.qwen', 'commands');
    const filePath = join(commandsDir, 'flow.1-spec.toml');

    if (existsSync(filePath)) {
      const content = readFileSync(filePath, 'utf-8');
      expect(content.length).toBeGreaterThan(0);
    }
  });

  it('应该能够多次调用而不报错', () => {
    qwenAdapter.generateCommands(testDir, templatesDir);
    qwenAdapter.generateCommands(testDir, templatesDir);

    const commandsDir = join(testDir, '.qwen', 'commands');
    expect(existsSync(commandsDir)).toBe(true);
  });
});