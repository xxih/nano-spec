import { describe, it, expect } from 'vitest';
import { listAvailableCommands } from './utils.js';

describe('listAvailableCommands', () => {
  it('should return array of command names without .toml extension', () => {
    const commands = listAvailableCommands();

    expect(Array.isArray(commands)).toBe(true);

    // Check that all commands don't have .toml extension
    commands.forEach(cmd => {
      expect(cmd).not.toMatch(/\.toml$/);
    });

    // Check that commands are sorted
    const sortedCommands = [...commands].sort();
    expect(commands).toEqual(sortedCommands);
  });

  it('should include expected core commands', () => {
    const commands = listAvailableCommands();

    // Check for core commands that should exist
    const expectedCommands = [
      'spec.1-spec',
      'spec.2-plan',
      'spec.3-execute',
      'spec.accept',
      'spec.align',
      'spec.summary',
    ];

    expectedCommands.forEach(cmd => {
      expect(commands).toContain(cmd);
    });
  });

  it('should include new commands (spec.init, spec.run, spec.clarify)', () => {
    const commands = listAvailableCommands();

    const newCommands = [
      'spec.init',
      'spec.run',
      'spec.clarify',
    ];

    newCommands.forEach(cmd => {
      expect(commands).toContain(cmd);
    });
  });

  it('should return at least 9 commands', () => {
    const commands = listAvailableCommands();

    expect(commands.length).toBeGreaterThanOrEqual(9);
  });
});