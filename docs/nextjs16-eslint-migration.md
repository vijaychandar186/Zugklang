# Next.js 16 Lint Migration (Official)

## What was updated

- Ran the official codemod:
  - `npx @next/codemod@canary next-lint-to-eslint-cli . --force`
- Migrated frontend linting from `next lint` to ESLint CLI.
- Aligned ESLint packages with Next.js 16.

## What changed

### `frontend/package.json`

- `scripts.lint` changed:
  - from: `next lint`
  - to: `eslint .`
- `devDependencies.eslint-config-next` changed:
  - from: `15.4.10`
  - to: `16.1.6`
- Removed `@eslint/eslintrc` (no longer needed after flat-config migration).

### `frontend/eslint.config.mjs`

- Moved to Next 16 flat-config style imports:
  - `eslint-config-next/core-web-vitals`
  - `eslint-config-next/typescript`
  - `eslint-config-prettier/flat`
- Added standard global ignores:
  - `.next/**`, `out/**`, `build/**`, `next-env.d.ts`

### `frontend/pnpm-lock.yaml`

- Updated lockfile to reflect the dependency/version changes above.

## Why this was required

In Next.js 16, `next lint` was removed. Linting must run through ESLint CLI directly.

## Suggestions from Next.js docs

- Official migration command:
  - `npx @next/codemod@canary next-lint-to-eslint-cli .`
- Recommended lint command:
  - `pnpm exec eslint .`
- Keep using `eslint-config-next/core-web-vitals` (recommended preset).
- Optionally add `eslint-config-next/typescript` for TypeScript lint rules.

## Current status

- The migration itself is complete and correct.
- `pnpm lint` now runs ESLint CLI (expected behavior on Next 16).
- Existing codebase lint errors remain and should be addressed separately.
