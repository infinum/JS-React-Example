# Vitest Configuration

Shared Vitest configuration for the monorepo. Every workspace with tests extends it through `createTestConfig()`, and only sets what is specific to it.

## Environments

The config has two presets. Pick the one that gives the most reliable signal for the code under test.

| Environment | Where tests run                                                       | Use it for                                                                                                     |
| ----------- | --------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| `jsdom`     | Node.js with a simulated DOM. Fast, and module mocking is easy.       | Code that needs Node-only mocks (server modules, `next-intl/server`) and `async` Server Components.            |
| `browser`   | Headless Chromium through Playwright (Vitest browser mode). Real DOM. | Client components that rely on real layout, focus, pointer events or browser APIs. Also Storybook story tests. |

jsdom has no layout, CSS, real focus, `matchMedia` or observers. If a component needs these, test it in `browser` instead of faking them.

The `browser` preset always uses Chromium, headless, with a 1280×720 viewport (`BROWSER_VIEWPORT`), so results are the same on every machine.

## What the base config sets

- **Test files:** `**/__tests__/**` and `**/*.{test,spec}.{ts,tsx,js}`. Stories and Playwright `*.e2e.spec.*` files are excluded.
- **Imports:** Vite's built-in `resolve.tsconfigPaths` resolves the `paths` from the package's `tsconfig.json`, and `@vitejs/plugin-react` handles JSX.
- **No globals:** import `describe`, `it`, `expect` and `vi` from `vitest` in every test file.
- **Isolation:** `clearMocks`, `unstubGlobals` and `unstubEnvs` are on, so tests don't leak state into each other.
- **`passWithNoTests`:** a package with no test files still passes.
- **Coverage:** V8 provider, `src/**/*.{ts,tsx}` without tests, stories and `src/tests/**`. Written to `coverage/<name>` at the repo root with the `json`, `lcov`, `text`, `clover`, `html` and `json-summary` reporters. The thresholds are 7% for branches, functions, lines and statements.
- **Reporters:** `default`, plus `github-actions` in CI. With `TEST_REPORT=true`, the tests also write `test-results/<name>/results.json` and `junit.xml` at the repo root.
- **`--changed`:** a change to a setup file (`src/tests/**`), `.storybook/**`, a `tsconfig*.json` or this config makes `vitest --changed` run the whole suite.

## Usage

Configs are ESM (`.mts`), because the workspaces are CommonJS.

```ts
// vitest.config.mts
import { createTestConfig } from '@infinum/configs/vitest';

export default createTestConfig({
	name: 'ui', // coverage/ui and test-results/ui
	environment: 'browser', // or 'jsdom'
	overrides: {
		test: { setupFiles: ['./src/tests/vitest.setup.ts'] },
	},
});
```

`overrides` is merged last with Vite's `mergeConfig`. Objects are merged deeply and **arrays are concatenated**, so an override adds to `setupFiles` or `plugins` instead of replacing them. To replace the test file patterns, pass the `include` option instead.

### Setup file

Register the DOM matchers and React Testing Library cleanup in the package's setup file. RTL only cleans up by itself when `afterEach` is a global, and this config doesn't use globals.

```ts
// src/tests/vitest.setup.ts
import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

afterEach(() => cleanup());
```

### Using both environments in one package

Use Vitest `projects` with one preset each:

```ts
import { createTestConfig } from '@infinum/configs/vitest';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		projects: [
			createTestConfig({ name: 'pkg', environment: 'jsdom', include: ['src/lib/**/*.test.ts'], overrides: { test: { name: 'unit' } } }),
			createTestConfig({ name: 'pkg', environment: 'browser', include: ['src/components/**/*.test.tsx'], overrides: { test: { name: 'browser' } } }),
		],
	},
});
```

## Scripts

Each workspace uses the same scripts:

```json
{
	"test": "vitest run",
	"test:watch": "vitest",
	"test:coverage": "vitest run --coverage",
	"test:coverage:watch": "vitest --coverage",
	"test:changed": "vitest run --changed ${TEST_CHANGED_BASE:-origin/main}"
}
```

To run only the tests related to specific files, for example from a hook: `pnpm --filter <pkg> exec vitest related <file…> --run`.

## ESLint

`@infinum/configs/eslint/vitest` applies the `@vitest/eslint-plugin` recommended rules to test files, and fails on focused tests (`.only`).

```js
// eslint.config.mjs
import vitestConfig from '@infinum/configs/eslint/vitest';

export default [...baseConfig, ...vitestConfig];
```
