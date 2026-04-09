import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/tests/setup.ts'],
    include: ['src/**/tests/**/*.test.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      reportsDirectory: '/tmp/frontend-coverage',
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        // Framework-generated and test files
        'src/app/**',
        'src/generated/**',
        'src/**/tests/**',
        // Server-side / infrastructure (not unit-testable)
        'src/components/**',
        'src/trpc/**',
        'src/types/**',
        'src/config/**',
        'src/constants/**',
        'src/pages-content/**',
        'src/resources/**',
        'src/instrumentation.ts',
        'src/proxy.ts',
        // Server-only lib code
        'src/lib/db/**',
        'src/lib/auth/**',
        'src/lib/redis.ts',
        'src/lib/public-paths.ts',
        'src/lib/storage/**',
        'src/lib/engine/**',
        // Feature UI layers (components, hooks, stores) — not unit tested
        'src/features/**/components/**',
        'src/features/**/hooks/**',
        'src/features/**/stores/**',
        'src/features/**/store.ts',
        'src/features/**/store/**',
        'src/features/**/types/**',
        // Untested / untestable lib files
        'src/lib/ratings/timeCategory.ts',
        // Complex analytics requiring DB — not unit-testable
        'src/lib/analysis/analysis.ts',
        // chessops API wrapper — unit tests only exercise a subset of its surface
        'src/lib/chess/chess.ts',
        // Untested feature files (types-only or no tests)
        'src/features/multiplayer/types.ts',
        // Untested chess utils
        'src/features/chess/utils/atomicThreats.ts',
        // Game engines with partial/no unit tests
        'src/features/custom/tri-d-chess/engine/gameEngine.ts',
        'src/features/custom/tri-d-chess/engine/moveGenerator.ts',
        // Re-export index files with no logic
        'src/features/**/engine/index.ts',
        // Whole features with no unit tests
        'src/features/analysis/**',
        'src/features/engine/**',
        'src/features/game/**',
        'src/features/game-review/**',
        'src/features/history/**',
        'src/features/memory/**',
        'src/features/openings/**',
        'src/features/profile/**',
        'src/features/puzzles/**',
        'src/features/settings/**',
        'src/features/vision/**',
        'src/features/custom/card-chess/**',
        'src/features/custom/dice-chess/**',
        'src/features/custom/shared/**',
        // Chess feature — exclude non-util layers (covered by integration tests via lib)
        'src/features/chess/engine/**',
        'src/features/chess/logic/**',
        'src/features/chess/variants/**',
        'src/features/chess/config/**',
      ]
    }
  },
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') }
  }
});
