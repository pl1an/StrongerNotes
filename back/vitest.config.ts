import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    setupFiles: ['./src/__tests__/setup.ts'],
    coverage: {
      provider: 'v8',
      include: ['src/modules/**', 'src/middleware/**'],
      exclude: ['src/__tests__/**'],
    },
  },
});
