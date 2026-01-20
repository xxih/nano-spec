import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { existsSync, mkdirSync, rmSync, readFileSync } from 'fs';
import { join } from 'path';
import { newTask } from './new.js';

describe('new command', () => {
  const testDir = join(process.cwd(), '.test-specflow-new');
  const specflowDir = join(testDir, 'specflow');

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

  it('应该在未初始化时显示错误', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    await newTask('test-task');

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      expect.stringContaining('请先运行 specflow init')
    );

    consoleErrorSpy.mockRestore();
  });

  it('应该创建带日期戳的任务目录', async () => {
    // 先初始化项目
    mkdirSync(specflowDir, { recursive: true });

    await newTask('用户认证功能');

    const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const taskDir = join(specflowDir, `${date}-用户认证功能`);

    expect(existsSync(taskDir)).toBe(true);
  });

  it('应该创建任务目录结构（brief.md、assets/、outputs/）', async () => {
    mkdirSync(specflowDir, { recursive: true });

    await newTask('test-task');

    const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const taskDir = join(specflowDir, `${date}-test-task`);

    expect(existsSync(join(taskDir, 'brief.md'))).toBe(true);
    expect(existsSync(join(taskDir, 'assets'))).toBe(true);
    expect(existsSync(join(taskDir, 'outputs'))).toBe(true);
  });

  it('应该创建包含任务名称的 brief.md', async () => {
    mkdirSync(specflowDir, { recursive: true });

    await newTask('用户认证功能');

    const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const briefPath = join(specflowDir, `${date}-用户认证功能`, 'brief.md');

    const content = readFileSync(briefPath, 'utf-8');
    expect(content).toContain('# 用户认证功能');
    expect(content).toContain('<!-- 在此描述需求 -->');
  });

  it('应该使用"待命名"作为默认名称', async () => {
    mkdirSync(specflowDir, { recursive: true });

    await newTask();

    const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const taskDir = join(specflowDir, `${date}-待命名`);

    expect(existsSync(taskDir)).toBe(true);
  });

  it('应该在目录已存在时显示警告', async () => {
    mkdirSync(specflowDir, { recursive: true });

    const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const taskDir = join(specflowDir, `${date}-test-task`);

    // 第一次创建
    await newTask('test-task');
    expect(existsSync(taskDir)).toBe(true);

    // 第二次创建应该警告
    const consoleWarnSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    await newTask('test-task');

    expect(consoleWarnSpy).toHaveBeenCalledWith(
      expect.stringContaining('目录已存在')
    );

    consoleWarnSpy.mockRestore();
  });

  it('应该正确处理包含特殊字符的任务名称', async () => {
    mkdirSync(specflowDir, { recursive: true });

    await newTask('用户登录&注册');

    const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const taskDir = join(specflowDir, `${date}-用户登录&注册`);

    expect(existsSync(taskDir)).toBe(true);
  });
});