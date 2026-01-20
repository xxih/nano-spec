import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    // 单个测试超时时间（毫秒）
    testTimeout: 10000,
    // 测试文件超时时间（毫秒）
    hookTimeout: 10000,
    // 并行执行测试
    pool: 'threads',
    // 每个测试文件的并发数
    poolOptions: {
      threads: {
        singleThread: false,
        minThreads: 1,
        maxThreads: 4,
      },
    },
    // 失败时终止
    bail: 1,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'dist/',
        '**/*.test.ts',
        '**/*.config.ts',
      ],
    },
  },
});