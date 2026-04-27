import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    passWithNoTests: true,
    exclude: ['**/node_modules/**', '**/dist/**', '**/test/integration/**'],
  },
  plugins: [tsconfigPaths() as any],
});
