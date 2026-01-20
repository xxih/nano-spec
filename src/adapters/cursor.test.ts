import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { existsSync, mkdirSync, rmSync, readFileSync } from 'fs';
import { join } from 'path';
import { cursorAdapter } from './cursor.js';

describe('cursor adapter', () => {
  const testDir = join(process.cwd(), '.test-cursor-adapter');
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
    expect(cursorAdapter.name).toBe('cursor');
    expect(cursorAdapter.commandsDir).toBe('.cursor/commands/');
    expect(cursorAdapter.fileFormat).toBe('md');
    expect(cursorAdapter.supportsVariables).toBe(false);
    expect(typeof cursorAdapter.generateCommands).toBe('function');
    expect(typeof cursorAdapter.transformCommand).toBe('function');
  });

  it('应该创建 .cursor/commands/ 目录', () => {
    cursorAdapter.generateCommands(testDir, templatesDir);

    const commandsDir = join(testDir, '.cursor', 'commands');
    expect(existsSync(commandsDir)).toBe(true);
  });

  it('应该生成 6 个 Markdown 命令文件', () => {
    cursorAdapter.generateCommands(testDir, templatesDir);

    const commandsDir = join(testDir, '.cursor', 'commands');
    const expectedFiles = [
      'flow.1-spec.md',
      'flow.2-plan.md',
      'flow.3-execute.md',
      'flow.accept.md',
      'flow.align.md',
      'flow.summary.md',
    ];

    for (const file of expectedFiles) {
      expect(existsSync(join(commandsDir, file))).toBe(true);
    }
  });

  it('生成的命令文件应该有内容', () => {
    cursorAdapter.generateCommands(testDir, templatesDir);

    const commandsDir = join(testDir, '.cursor', 'commands');
    const filePath = join(commandsDir, 'flow.1-spec.md');

    if (existsSync(filePath)) {
      const content = readFileSync(filePath, 'utf-8');
      expect(content.length).toBeGreaterThan(0);
    }
  });

  it('transformCommand 应该返回原始内容', () => {
    const markdown = `# Command: test
# Description: Test command
prompt = """Test prompt"""`;

    const result = cursorAdapter.transformCommand!(markdown, 'test');
    expect(result).toBe(markdown);
  });

  it('应该能够多次调用而不报错', () => {
    cursorAdapter.generateCommands(testDir, templatesDir);
    cursorAdapter.generateCommands(testDir, templatesDir);

    const commandsDir = join(testDir, '.cursor', 'commands');
    expect(existsSync(commandsDir)).toBe(true);
  });
});