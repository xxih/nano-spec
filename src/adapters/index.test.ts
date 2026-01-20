import { describe, it, expect } from 'vitest';
import { getAdapter, listAdapters, type AIAdapter } from './index.js';

describe('adapters index', () => {
  it('应该列出所有注册的适配器', () => {
    const adapters = listAdapters();

    expect(adapters).toContain('cursor');
    expect(adapters).toContain('qwen');
    expect(adapters).toContain('iflow');
    expect(adapters).toContain('cline');
    expect(adapters.length).toBe(4);
  });

  it('应该能获取已注册的适配器', () => {
    const cursorAdapter = getAdapter('cursor');
    expect(cursorAdapter).toBeDefined();
    expect(cursorAdapter?.name).toBe('cursor');
    expect(cursorAdapter?.commandsDir).toBe('.cursor/commands/');

    const qwenAdapter = getAdapter('qwen');
    expect(qwenAdapter).toBeDefined();
    expect(qwenAdapter?.name).toBe('qwen');

    const iflowAdapter = getAdapter('iflow');
    expect(iflowAdapter).toBeDefined();
    expect(iflowAdapter?.name).toBe('iflow');

    const clineAdapter = getAdapter('cline');
    expect(clineAdapter).toBeDefined();
    expect(clineAdapter?.name).toBe('cline');
  });

  it('应该对未注册的适配器返回 null', () => {
    const adapter = getAdapter('unsupported');
    expect(adapter).toBeNull();
  });

  it('所有适配器应该有必需的方法', () => {
    const adapters = listAdapters();

    for (const name of adapters) {
      const adapter = getAdapter(name);
      expect(adapter).toBeDefined();
      expect(typeof adapter?.generateCommands).toBe('function');
      expect(typeof adapter?.transformCommand).toBe('function');
    }
  });

  it('所有适配器应该有正确的属性结构', () => {
    const adapters = listAdapters();

    for (const name of adapters) {
      const adapter = getAdapter(name) as AIAdapter;

      expect(adapter).toHaveProperty('name');
      expect(adapter).toHaveProperty('commandsDir');
      expect(adapter).toHaveProperty('fileFormat');
      expect(adapter).toHaveProperty('supportsVariables');
      expect(adapter).toHaveProperty('generateCommands');
      expect(adapter).toHaveProperty('transformCommand');

      expect(typeof adapter.name).toBe('string');
      expect(typeof adapter.commandsDir).toBe('string');
      expect(typeof adapter.fileFormat).toBe('string');
      expect(typeof adapter.supportsVariables).toBe('boolean');
      expect(typeof adapter.generateCommands).toBe('function');
      expect(typeof adapter.transformCommand).toBe('function');

      expect(adapter.name.length).toBeGreaterThan(0);
      expect(adapter.commandsDir.length).toBeGreaterThan(0);
      expect(['md', 'toml', 'json', 'yaml']).toContain(adapter.fileFormat);
    }
  });

  it('iflow 适配器应该使用 TOML 格式', () => {
    const iflowAdapter = getAdapter('iflow') as AIAdapter;
    expect(iflowAdapter.fileFormat).toBe('toml');
  });

  it('cursor、qwen、cline 适配器应该使用 Markdown 格式', () => {
    const cursorAdapter = getAdapter('cursor') as AIAdapter;
    const qwenAdapter = getAdapter('qwen') as AIAdapter;
    const clineAdapter = getAdapter('cline') as AIAdapter;

    expect(cursorAdapter.fileFormat).toBe('md');
    expect(qwenAdapter.fileFormat).toBe('md');
    expect(clineAdapter.fileFormat).toBe('md');
  });
});