# Technical Design: Migrate from Jest to Vitest

- **PRD:** [prd-jest-to-vitest-migration.md](./prd-jest-to-vitest-migration.md). Requirement numbers (R1…R43) and decision numbers (D3.1…D3.5) in this document refer to the PRD.
- **Status:** Draft
- **Date:** 2026-09-29

This document explains **how** to implement the PRD. The code blocks are **sketches**: they show the intended shape and the important options, but they are not meant to be pasted without checking. If a sketch disagrees with the version-matched docs of the installed packages, the docs win.

---

## 1. Summary

- Vitest **4.1.x** in all three test workspaces (not 5.x, see §2).
- A shared config factory `createTestConfig()` in `@infinum/configs/vitest` with two presets: `jsdom` and `browser` (Chromium through Playwright).
- `apps/frontend` uses the jsdom preset. `packages/ui` and `apps/storybook` use the browser preset.
- Storybook switches to `@storybook/nextjs-vite` and adds `@storybook/addon-vitest`. A11y is set to `test: 'error'`.
- Every package gets a new `test:changed` script (Vitest `--changed`). Turbo `--affected` picks the packages. This powers pre-push and, later, agent hooks.
- Turbo test caching is fixed. Today its inputs ignore source files, so a source change doesn't invalidate the cache (see §8). Chromium is cached in CI.
- Jest, `ts-jest`, `@types/jest`, `eslint-plugin-jest` and `jest-environment-jsdom` are all removed in the same PR.

## 2. Versions and dependencies

All versions go into the pnpm catalog (`pnpm-workspace.yaml`) and are referenced as `catalog:`.

| Package                      | Version  | Used in                          | Notes                                                                                                                                                                                                   |
| ---------------------------- | -------- | -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `vitest`                     | `4.1.11` | configs, frontend, ui, storybook | **Pinned to 4.x.** `@storybook/addon-vitest@10.6.0` accepts `vitest ^3 \|\| ^4`. Vitest 5 support only exists in Storybook 11 (alpha). Upgrading to Vitest 5 together with Storybook 11 is a follow-up. |
| `@vitest/browser-playwright` | `4.1.11` | configs, ui, storybook           | Browser provider. It must match the `vitest` version exactly.                                                                                                                                           |
| `@vitest/browser`            | `4.1.11` | storybook                        | Peer of `@storybook/addon-vitest`.                                                                                                                                                                      |
| `@vitest/coverage-v8`        | `4.1.11` | configs, frontend, ui, storybook | V8 coverage works in both Node and Chromium browser mode.                                                                                                                                               |
| `playwright`                 | `1.62.0` | configs, ui, storybook           | **Same version as the existing `@playwright/test: 1.62.0`**, so the downloaded browsers are shared with E2E.                                                                                            |
| `vite`                       | `8.3.0`  | configs, frontend, ui, storybook | Needed by Vitest, `@vitejs/plugin-react@6` and `@storybook/nextjs-vite`. `8.3.1` is inside the 7-day `minimumReleaseAge` window.                                                                        |
| `@vitejs/plugin-react`       | `6.1.x`  | configs                          | Needs Vite 8. The optional peers (`oxc-transform-react`, React Compiler) are not needed.                                                                                                                |
| ~~`vite-tsconfig-paths`~~    | —        | —                                | **Not used** (§16, deviation 4). Vite 8's built-in `resolve.tsconfigPaths` resolves the `@/…` and `@infinum/ui/…` aliases from each package's `tsconfig.json` (R7).                                     |
| `jsdom`                      | `30.x`   | frontend                         | DOM environment for the jsdom preset (D3.1).                                                                                                                                                            |
| `@storybook/nextjs-vite`     | `10.6.0` | storybook, ui                    | Replaces `@storybook/nextjs`. The version must match `storybook`.                                                                                                                                       |
| `@storybook/addon-vitest`    | `10.6.0` | storybook                        | Runs stories as tests.                                                                                                                                                                                  |
| `next`                       | catalog  | storybook                        | Peer of `@storybook/nextjs-vite`. Storybook doesn't depend on `next` today, so add it as a devDependency.                                                                                               |
| `@vitest/eslint-plugin`      | `1.6.x`  | configs                          | Replaces `eslint-plugin-jest`.                                                                                                                                                                          |
| `@testing-library/*`         | existing | frontend, ui                     | No change. `@testing-library/jest-dom@7` supports Vitest through the `@testing-library/jest-dom/vitest` entry point.                                                                                    |

**Removed from the catalog and all `package.json` files:** `jest`, `jest-environment-jsdom`, `ts-jest`, `@types/jest`, `eslint-plugin-jest`, `@storybook/nextjs`, and `ts-node` if `pnpm why ts-node` shows no other user (R38).

> Before adding anything, check the latest patch versions with `pnpm view <pkg> version` and check the peer ranges with `pnpm view <pkg>@<ver> peerDependencies`. The table above was checked on 2026-09-29.

## 3. Architecture

### 3.1 Where each test runs

```
                              ┌───────────────────────────────────────────┐
 pnpm test ─► turbo run test ─┤ @infinum/frontend   vitest · jsdom (Node) │  → coverage/frontend
                              │ @infinum/ui         vitest · Chromium     │  → coverage/ui
                              │ @infinum/storybook  vitest · Chromium     │  → coverage/storybook
                              │   └─ storybookTest() turns every story    │     (covers packages/ui/src)
                              │      into a test: render + play + a11y    │
                              └───────────────────────────────────────────┘
```

| Workspace        | Preset    | Why (see PRD D3.1)                                                                                                                      |
| ---------------- | --------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `apps/frontend`  | `jsdom`   | Tests mock server-only modules (`@/lib/auth`, `next-intl/server`) and call async Server Components. The real browser is covered by E2E. |
| `packages/ui`    | `browser` | Client-only Radix components. Real pointer events, focus and layout replace the fakes. Same environment as the story and visual tests.  |
| `apps/storybook` | `browser` | Required by `@storybook/addon-vitest`.                                                                                                  |

We don't use a single root Vitest config with `projects`. Each package keeps its own config, and Turbo orchestrates them. This matches the existing Turbo-per-package model, keeps per-package caching, and lets `turbo --affected` skip packages that didn't change.

### 3.2 New and changed files

```
packages/configs/
  src/vitest-config/
    index.mjs          NEW  createTestConfig(), presets, shared constants
    index.d.mts        NEW  types for the above
    README.md          NEW  replaces src/jest-config/README.md
  src/jest-config/     DELETE
  src/eslint-config/
    vitest.mjs         NEW  replaces jest.mjs
    jest.mjs           DELETE
  package.json         exports: "./vitest", "./eslint/vitest" (remove "./jest", "./eslint/jest")

apps/frontend/
  vitest.config.mts    NEW  (replaces jest.config.ts)
  src/tests/vitest.setup.tsx  RENAMED from jest.setup.tsx and rewritten
  src/tests/styleMock.js      DELETE (Vitest ignores CSS by default)
  tsconfig.build.json  update the excludes (jest.* → vitest.*)

packages/ui/
  vitest.config.mts    NEW  (replaces jest.config.js)
  src/tests/vitest.setup.ts   RENAMED from jest.setup.ts and slimmed down
  src/tests/styleMock.js      DELETE
  tsconfig.jest.json   DELETE (Jest-only, §16 deviation 7)
  postcss.config.js    RENAMED to postcss.config.mjs (§16 deviation 5)

apps/storybook/
  vitest.config.mts    NEW
  .storybook/main.ts   framework → @storybook/nextjs-vite, + addon-vitest, + viteFinal (aliases)
  .storybook/preview.ts  type import + a11y.test = 'error'
  .storybook/vitest.setup.ts  NEW only if the addon version still needs it (see §6.3)

scripts/
  test-affected.sh     NEW  pre-push entry point (§7)
  install-test-browsers.sh  NEW  bootstrap step (§9.2)
  bootstrap.sh         add the step above
  aggregate-coverage-results.js  comment update only

.github/actions/test-browsers-setup/action.yml  NEW  (§9.1)
.github/workflows/coverage.yml                  use the action above
turbo.json           test task inputs/outputs/env (§8)
package.json (root)  test:changed, test:affected; pre-push uses test:affected
.gitignore           /test-results, **/test-results, **/__screenshots__ (browser mode failure screenshots)
```

All workspaces are `"type": "commonjs"`, so the config files use `.mts`/`.mjs` to be ESM. This is the same approach the Next.js Vitest guide uses (`vitest.config.mts`) and the same as the existing `eslint-config/*.mjs` files.

## 4. Shared config — `@infinum/configs/vitest`

### 4.1 API

```ts
// index.d.mts (sketch)
import type { ViteUserConfig } from 'vitest/config';

export type TestEnvironment = 'jsdom' | 'browser';

export interface CreateTestConfigOptions {
	/** Package short name. It's used for coverage/<name> and test-results/<name>. */
	name: string;
	environment: TestEnvironment;
	/** Replaces TEST_INCLUDE (see §16, deviation 3). */
	include?: string[];
	/** Merged last, so a package can override anything. */
	overrides?: ViteUserConfig;
}

export function createTestConfig(options: CreateTestConfigOptions): ViteUserConfig;

export const TEST_INCLUDE: string[];
export const COVERAGE_EXCLUDE: string[];
export const BROWSER_VIEWPORT: { width: number; height: number };
```

### 4.2 Implementation sketch

```js
// packages/configs/src/vitest-config/index.mjs (sketch)
import path from 'node:path';
import react from '@vitejs/plugin-react';
import { playwright } from '@vitest/browser-playwright';
import { configDefaults, defineConfig, mergeConfig } from 'vitest/config';

// Same patterns as the old Jest testMatch (PRD R1)
export const TEST_INCLUDE = ['**/__tests__/**/*.{ts,tsx,js}', '**/*.{test,spec}.{ts,tsx,js}'];
const TEST_EXCLUDE = [...configDefaults.exclude, '**/*.e2e.spec.*', '**/*.stories.*', '**/__stories__/**'];

export const COVERAGE_EXCLUDE = ['src/**/*.d.ts', 'src/**/*.{test,spec}.{ts,tsx}', 'src/**/*.stories.{ts,tsx}', 'src/**/__tests__/**', 'src/**/__stories__/**', 'src/tests/**'];

// Same viewport as packages/configs/src/playwright-config/base.js, so screenshots are consistent later (R32)
export const BROWSER_VIEWPORT = { width: 1280, height: 720 };

const repoRoot = path.resolve(import.meta.dirname, '../../../..');

const machineReporters = (name) =>
	process.env.TEST_REPORT === 'true'
		? [
				['json', { outputFile: path.join(repoRoot, 'test-results', name, 'results.json') }],
				['junit', { outputFile: path.join(repoRoot, 'test-results', name, 'junit.xml') }],
			]
		: [];

const presets = {
	jsdom: { test: { environment: 'jsdom' } },
	browser: {
		test: {
			browser: {
				enabled: true,
				provider: playwright(),
				headless: true,
				instances: [{ browser: 'chromium' }],
				viewport: BROWSER_VIEWPORT,
			},
		},
	},
};

export function createTestConfig({ name, environment, overrides = {} }) {
	const base = defineConfig({
		plugins: [react()],
		resolve: { tsconfigPaths: true }, // built into Vite 8 (§16, deviation 4)
		test: {
			include, // option, defaults to TEST_INCLUDE (§16, deviation 3)
			exclude: TEST_EXCLUDE,
			passWithNoTests: true, // PRD R17 (was --passWithNoTests)
			clearMocks: true, // call history is reset between tests → deterministic (R31)
			unstubGlobals: true,
			unstubEnvs: true,
			reporters: [process.env.GITHUB_ACTIONS ? 'github-actions' : null, 'default', ...machineReporters(name)].filter(Boolean),
			// If any of these change, `--changed` runs the whole suite (R35 fallback)
			forceRerunTriggers: [
				...configDefaults.forceRerunTriggers,
				'**/src/tests/**',
				'**/.storybook/**',
				'**/tsconfig*.json',
				'**/packages/configs/src/vitest-config/**',
			],
			coverage: {
				provider: 'v8',
				reportsDirectory: path.join(repoRoot, 'coverage', name),
				reporter: ['json', 'lcov', 'text', 'clover', 'html', 'json-summary'],
				include: ['src/**/*.{ts,tsx}'],
				exclude: COVERAGE_EXCLUDE,
				thresholds: { branches: 7, functions: 7, lines: 7, statements: 7 },
			},
		},
	});
	return mergeConfig(mergeConfig(base, presets[environment]), overrides);
}
```

Notes:

- `mergeConfig` **concatenates** arrays. To _replace_ an array (for example `coverage.include` in Storybook), the package sets it in `overrides`, and the result has to be checked. If concatenation gets in the way, add an explicit option to `createTestConfig`, such as `coverageInclude`, instead of relying on merge behavior.
- `@vitejs/plugin-react`, `@vitest/browser-playwright` and `playwright` go into `packages/configs` `devDependencies`. The ESLint plugins are handled the same way today (the workspace link resolves them). The consuming packages also list `vitest` and `@vitest/coverage-v8` themselves, so their `vitest` binary resolves locally.
- **No `globals: true`** (D3.5). TypeScript then rejects a test that uses `describe` without importing it, so no extra lint rule is needed.
- Add to `package.json` exports: `"./vitest": { "types": "./src/vitest-config/index.d.mts", "default": "./src/vitest-config/index.mjs" }`.

### 4.3 ESLint — `@infinum/configs/eslint/vitest`

```js
// packages/configs/src/eslint-config/vitest.mjs (sketch)
import vitest from '@vitest/eslint-plugin';

export default [
	{
		files: ['**/*.test.ts', '**/*.test.tsx', '**/__tests__/**/*.{ts,tsx}'],
		...vitest.configs.recommended,
		rules: {
			...vitest.configs.recommended.rules,
			'vitest/no-focused-tests': 'error', // R4: no committed .only
			'vitest/no-disabled-tests': 'warn',
		},
	},
	{ ignores: ['**/coverage', '**/test-results'] },
];
```

Replace `jestConfig` with `vitestConfig` in `apps/frontend/eslint.config.mjs` and `packages/ui/eslint.config.mjs`. Remove the `!…/jest-config/**` input exclusions from the `lint*` tasks in `turbo.json`.

## 5. Package configs

### 5.1 `apps/frontend` (jsdom)

```ts
// apps/frontend/vitest.config.mts (sketch)
import { createTestConfig } from '@infinum/configs/vitest';

export default createTestConfig({
	name: 'frontend',
	environment: 'jsdom',
	overrides: {
		test: {
			setupFiles: ['./src/tests/vitest.setup.tsx'],
			// next-intl imports 'next/navigation' without an extension. Inlining lets Vite resolve it.
			// This replaces the old Jest transformIgnorePatterns workaround.
			server: { deps: { inline: ['next-intl'] } },
		},
	},
});
```

```tsx
// apps/frontend/src/tests/vitest.setup.tsx (sketch)
import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

// RTL registers its auto-cleanup only when afterEach is a global. We don't use globals (D3.5), so register it here.
afterEach(() => cleanup());

vi.mock('next-intl/server', () => ({
	getTranslations: (namespace: string) => Promise.resolve((key: string) => `${namespace}.${key}`),
}));

vi.mock('next/link', () => ({
	default: ({ href, children, ...props }: any) => (
		<a href={href} {...props}>
			{children}
		</a>
	),
}));
```

- The `next/router` spy in the old setup file is **dropped**. No app code imports `next/router` (checked with `grep -rn "next/router" apps/frontend/src`), so the spy had no effect (R8 is still met). `jest.spyOn` on an ESM namespace also isn't possible in Vitest.
- `src/tests/utils.tsx` (`render`, `renderServer`) needs no changes (R9).
- `tsconfig.build.json` excludes: replace `**/jest.setup.tsx` and `**/jest.config.ts` with `**/vitest.setup.tsx` and `vitest.config.mts`.
- `resolve.tsconfigPaths` reads `apps/frontend/tsconfig.json`, which already defines `@/*` and `@infinum/ui/*` (R7).

### 5.2 `packages/ui` (browser)

```ts
// packages/ui/vitest.config.mts (sketch)
import { createTestConfig } from '@infinum/configs/vitest';

export default createTestConfig({
	name: 'ui',
	environment: 'browser',
	overrides: { test: { setupFiles: ['./src/tests/vitest.setup.ts'] } },
});
```

```ts
// packages/ui/src/tests/vitest.setup.ts (sketch)
import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

afterEach(() => cleanup());
// The matchMedia, ResizeObserver and IntersectionObserver fakes are gone: Chromium provides the real ones (R14).
```

- The old `'^@/(.*)$'` mapping is dropped. `packages/ui/tsconfig.json` doesn't define `@/*`, and no ui source uses it. Check with `grep -rn "from '@/" packages/ui/src`.
- The Tailwind stylesheet is **not** loaded in ui unit tests. The existing assertions check class names, not computed styles. Style-dependent checks belong in the Storybook story and visual tests, where `preview.ts` loads the CSS.
- `cn.test.ts` runs in the browser along with the other tests (R15). One environment per package keeps the config simple, and the cost is a few milliseconds.

### 5.3 `apps/storybook` — see §6.

### 5.4 Package scripts (frontend, ui, storybook)

```json
{
	"test": "vitest run",
	"test:watch": "vitest",
	"test:coverage": "vitest run --coverage",
	"test:coverage:watch": "vitest --coverage",
	"test:changed": "vitest run --changed ${TEST_CHANGED_BASE:-origin/main}"
}
```

- `vitest` defaults to watch mode, so non-watch scripts need `run`.
- `--passWithNoTests` has moved into the shared config.
- For Storybook, `test` runs the story tests. `apps/storybook` has no `*.test.*` files of its own.

## 6. Storybook

### 6.1 Framework switch (`@storybook/nextjs` → `@storybook/nextjs-vite`)

1. Run `pnpm --filter @infinum/storybook exec storybook automigrate nextjs-to-nextjs-vite`. The automigration updates `main.ts`, the dependencies and the story imports inside `apps/storybook`.
2. The stories live in **`packages/ui/src/components/__stories__/`**, outside the Storybook app, so the automigration may miss them. Update their imports by hand: `import type { Meta, StoryObj } from '@storybook/nextjs-vite';`. Also swap `@storybook/nextjs` for `@storybook/nextjs-vite` in `packages/ui/package.json`.
3. Convert whatever the automigration wrote to `catalog:` references, and pin the versions from §2.
4. Add `vite` and `next` (`catalog:`) to `apps/storybook` devDependencies.
5. Aliases: `preview.ts` imports `@/src/...`, and the stories import `@infinum/ui/...`. Both are defined in `apps/storybook/tsconfig.json`. Add them in `viteFinal`:

```ts
// apps/storybook/.storybook/main.ts (sketch — changed parts only)
import type { StorybookConfig } from '@storybook/nextjs-vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import { mergeConfig } from 'vite';

const config: StorybookConfig = {
	// stories: unchanged
	addons: [
		'@storybook/addon-themes',
		'@storybook/addon-docs',
		'@storybook/addon-a11y',
		'@storybook/addon-designs',
		'@storybook/addon-mcp',
		'@storybook/addon-vitest',
	],
	framework: { name: '@storybook/nextjs-vite', options: {} },
	viteFinal: (config) => mergeConfig(config, { plugins: [tsconfigPaths()] }),
	// core, features, docs: unchanged
};
```

6. Tailwind: `postcss.config.js` (`@tailwindcss/postcss`) is picked up by Vite automatically. No change is needed. Moving to `@tailwindcss/vite` is out of scope.
7. Check that `pnpm --filter @infinum/storybook dev` and `build` work, the three themes switch correctly, and the Docker build (`apps/storybook/Dockerfile`, which runs `pnpm build`) still passes (R19, R20).

### 6.2 Story tests (`@storybook/addon-vitest`)

```ts
// apps/storybook/vitest.config.mts (sketch)
import path from 'node:path';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { createTestConfig } from '@infinum/configs/vitest';

const dirname = import.meta.dirname;

export default createTestConfig({
	name: 'storybook',
	environment: 'browser',
	overrides: {
		plugins: [
			storybookTest({
				configDir: path.join(dirname, '.storybook'),
				storybookScript: 'pnpm dev --ci', // used only by the Storybook UI widget for "open in Storybook" links
			}),
		],
		test: {
			coverage: {
				// Stories render packages/ui components, so measure those files (PRD D3.3)
				include: ['../../packages/ui/src/**/*.{ts,tsx}'],
				allowExternal: true, // required for files outside the package root
				thresholds: undefined, // report-only at first (PRD D3.3)
			},
		},
	},
});
```

- `storybookTest()` reads `stories` from `.storybook/main.ts`, so the `../../../packages/ui/...` glob is picked up automatically.
- The default tag filter is `include: ['test']`, and stories carry the `test` tag by default. Nothing needs to change.
- Check the final merged `coverage.include`. Because of array concatenation (§4.2), it may also contain `src/**` from the base config. That's harmless, because `apps/storybook/src` has no components, but it adds noise.
- The widget in the Storybook sidebar works in dev mode because the addon is registered in `main.ts` (R23, PRD §7).

### 6.3 Setup file

Older addon versions needed `.storybook/vitest.setup.ts` with `setProjectAnnotations([...])`. In Storybook 10, check the addon docs for the installed version (`node_modules/@storybook/addon-vitest/README.md`, or run `storybook add @storybook/addon-vitest` on a throwaway branch and look at what it generates):

- If it generates a setup file, keep it and add it to `test.setupFiles`.
- If it doesn't, don't add one.

### 6.4 Accessibility = error (PRD D3.2, R21–R22)

```ts
// apps/storybook/.storybook/preview.ts (changed parts)
import type { Preview } from '@storybook/nextjs-vite';

const preview: Preview = {
	parameters: {
		// ...
		a11y: { test: 'error' }, // A11yTest = 'off' | 'todo' | 'error'
	},
};
```

A per-story opt-out must include a comment with the reason:

```ts
export const KnownIssue: Story = {
	parameters: {
		// a11y: Radix Select trigger reports <reason>; tracked in <link>. Remove when fixed.
		a11y: { test: 'todo' },
	},
};
```

Document this pattern in `documentation/UI Components Guide.md`.

## 7. Feedback-loop signals (PRD §5.5)

| Need                         | Mechanism                                                                                                                                                                       |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Reliable exit code (R27)     | `vitest run` exits with 1 on any failure, including an a11y `error`. Turbo exits with non-zero if any task fails, and `--continue` still runs the rest.                         |
| Only affected tests (R28)    | Package level: `vitest run --changed <ref>`. Repo level: `turbo run test:changed --affected`. Single file (for hooks): `pnpm --filter <pkg> exec vitest related <file…> --run`. |
| Machine-readable (R29)       | `TEST_REPORT=true pnpm test` writes `test-results/<pkg>/results.json` and `junit.xml` at the repo root. The terminal output stays the same.                                     |
| Low-noise failures (R30)     | Default reporter. The existing `onError` filter in `src/tests/utils.tsx` keeps missing-message noise out. In CI, the `github-actions` reporter adds inline annotations.         |
| Deterministic (R31)          | `clearMocks`, `unstubGlobals` and `unstubEnvs` are on. A fixed browser and viewport. No retries are configured, so a flaky test surfaces instead of being hidden.               |
| Fixed browser settings (R32) | Chromium, headless, 1280×720, all set in the shared preset.                                                                                                                     |

### 7.1 Pre-push: `scripts/test-affected.sh` (R35)

```bash
#!/usr/bin/env bash
# Runs only the tests affected by the commits being pushed. Falls back to the full suite.
set -euo pipefail

base="$(git merge-base HEAD origin/main 2>/dev/null || true)"

if [ -z "$base" ]; then
	echo "⚠️  Could not determine merge-base with origin/main, running the full test suite"
	exec pnpm test
fi

export TEST_CHANGED_BASE="$base" # read by each package's test:changed script
export TURBO_SCM_BASE="$base"    # read by turbo --affected
exec pnpm turbo run test:changed --affected --parallel --log-order=grouped --continue
```

Root `package.json`:

```json
{
	"test:changed": "turbo run test:changed --parallel --log-order=grouped --continue",
	"test:affected": "bash ./scripts/test-affected.sh",
	"pre-push": "pnpm lint && pnpm prettier:check && pnpm test:affected"
}
```

How the full-suite fallback works:

- **Turbo:** a change in `packages/configs` (a dependency of every package), in `turbo.json` or in the lockfile marks packages as affected.
- **Vitest:** a changed file that matches `forceRerunTriggers` (setup files, `.storybook/`, `tsconfig*.json`, the shared Vitest config, `package.json`) makes `--changed` run the whole suite for that package.
- **Git:** if there's no merge-base (a shallow clone, or no `origin/main`), the script runs `pnpm test`.

Pre-push stops running coverage. Coverage on a subset of tests means nothing, and CI still runs `pnpm test:coverage` on the full suite. This change is covered by R35.

## 8. Turbo

**Current bug:** `test` and `test:coverage` only hash `**/*.test.*` and the jest-config. A change to a component's source is a cache hit, and the tests don't re-run. Fixed below (R36).

```jsonc
// turbo.json (sketch — test tasks only)
{
	"test": {
		"inputs": ["$TURBO_DEFAULT$", "../../packages/configs/src/vitest-config/**"],
		"env": ["TEST_REPORT"],
		"outputs": ["../../test-results/**"],
	},
	"@infinum/frontend#test": {
		"inputs": ["$TURBO_DEFAULT$", "../../packages/configs/src/vitest-config/**", "../../packages/ui/src/**"],
		"env": ["TEST_REPORT"],
		"outputs": ["../../test-results/frontend/**"],
	},
	"@infinum/storybook#test": {
		"inputs": ["$TURBO_DEFAULT$", "../../packages/configs/src/vitest-config/**", "../../packages/ui/src/**"],
		"env": ["TEST_REPORT"],
		"outputs": ["../../test-results/storybook/**"],
	},
	// test:coverage: the same three entries, with outputs "../../coverage/<name>/**" (+ test-results)
	"test:changed": { "cache": false, "passThroughEnv": ["TEST_CHANGED_BASE"] },
	"test:watch": { "cache": false, "persistent": true },
	"test:coverage:watch": { "cache": false, "persistent": true },
}
```

- **Outputs are per package.** A shared `../../coverage/**` output would make a cache restore for one package overwrite the other packages' coverage with stale files.
- `frontend` and `storybook` import `packages/ui/src` through an alias, not through a built dependency. Turbo doesn't see that relationship, so `packages/ui/src/**` is listed as an explicit input. `build` already does the same.
- `$TURBO_DEFAULT$` covers source, tests, stories, `.storybook/`, `vitest.config.mts` and `package.json` (R36, "caching never hides a failure").
- **Check:** Playwright finds its browsers through `HOME` (`~/.cache/ms-playwright`) or `PLAYWRIGHT_BROWSERS_PATH`, and the `github-actions` reporter needs `GITHUB_ACTIONS`. Turbo's strict env mode may filter these out. If browser launch fails under Turbo, add them to `globalPassThroughEnv`.

## 9. CI and local browsers

### 9.1 `.github/actions/test-browsers-setup/action.yml` (R36–R37)

```yaml
name: 🧪 Test browsers setup
description: Install (cached) Chromium for Vitest browser mode
runs:
  using: composite
  steps:
    - id: pw
      run: echo "version=$(pnpm --filter @infinum/ui exec playwright --version | awk '{print $2}')" >> "$GITHUB_OUTPUT"
      shell: bash
    - id: cache
      uses: actions/cache@0057852bfaa89a56745cba8c7296529d2fc39830
      with:
        path: ~/.cache/ms-playwright
        key: ${{ runner.os }}-playwright-chromium-${{ steps.pw.outputs.version }}
    - if: steps.cache.outputs.cache-hit != 'true'
      run: pnpm --filter @infinum/ui exec playwright install --with-deps chromium
      shell: bash
    - if: steps.cache.outputs.cache-hit == 'true'
      run: pnpm --filter @infinum/ui exec playwright install-deps chromium # OS libraries are not cached
      shell: bash
```

- The key is the **Playwright version**, not the lockfile hash. An unrelated dependency bump then doesn't throw away the browser cache.
- Pin the action by SHA, like the other actions in the repo.
- In `coverage.yml`, add `uses: ./.github/actions/test-browsers-setup` between "Node setup" and "Test".
- The Turbo cache is already restored by `.github/actions/node-setup`. With the §8 inputs, unchanged packages are cache hits on the second run.
- `e2e.yml` runs in the `mcr.microsoft.com/playwright:v1.57.0-noble` container, which is behind `@playwright/test@1.62.0`. That mismatch already exists and doesn't block this work, but note it as a follow-up.

### 9.2 Local: `scripts/install-test-browsers.sh`

Add this as a step in `scripts/bootstrap.sh`, which runs on `postinstall`:

```bash
#!/bin/bash
if [ -n "${CI:-}" ]; then echo "   ⏭️  CI detected, browsers installed by workflow"; exit 0; fi
if [ ! -x packages/ui/node_modules/.bin/playwright ]; then echo "   ⏭️  Playwright not installed"; exit 0; fi
set -euo pipefail
echo "🧪 Ensuring Chromium for Vitest browser tests..."
pnpm --filter @infinum/ui exec playwright install chromium # no-op if already present
```

## 10. Test migration

### 10.1 Baseline (do this first, on the unchanged branch)

Record the following in the PR description (PRD Success Metrics):

- Test counts per file, from `pnpm --filter <pkg> exec jest --json`. From a grep today: frontend has 24 cases in 4 files, and ui has 32 cases in 6 files.
- `coverage/*/coverage-summary.json` totals for `frontend` and `ui`.
- `pnpm test:coverage` wall-clock time, locally and from the last green `coverage.yml` run.

### 10.2 API mapping

| Jest                                              | Vitest                                                                 |
| ------------------------------------------------- | ---------------------------------------------------------------------- |
| globals `describe`, `it`, `expect`, `beforeEach`  | `import { describe, it, expect, beforeEach } from 'vitest'`            |
| `jest.fn()`, `jest.spyOn()`                       | `vi.fn()`, `vi.spyOn()`                                                |
| `jest.mock(path, factory)`                        | `vi.mock(path, factory)` (also hoisted)                                |
| `{ __esModule: true, default: X }` in a factory   | `{ default: X }`                                                       |
| `jest.mock(path, factory, { virtual: true })`     | `vi.mock(path, factory)` (the files exist, so `virtual` isn't needed)  |
| `require('mod').fn as jest.MockedFunction<…>`     | `import { fn } from 'mod'` at the top, then `vi.mocked(fn)`            |
| `x as jest.MockedFunction<typeof x>`              | `vi.mocked(x)`                                                         |
| `jest.clearAllMocks()`                            | `vi.clearAllMocks()` (redundant with `clearMocks: true`, but harmless) |
| An outer variable used inside a `vi.mock` factory | Wrap it in `vi.hoisted(() => …)`                                       |
| `import '@testing-library/jest-dom'`              | `import '@testing-library/jest-dom/vitest'` (in the setup file only)   |

### 10.3 Per-file notes

| File                                              | Notes                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| ------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `frontend/…/HomePage/HomePage.test.tsx`           | Replace the two `require(...)` lines with top-level imports and `vi.mocked`. It re-mocks `next-intl/server` with `vi.fn()`, and the file-level `vi.mock` wins over the setup-file mock. Check that. Keep `await HomePage()` then `render(...)` (PRD D3.4).                                                                                                                                                                                                                                                                                                                                                   |
| `frontend/…/ThemeToggle/ThemeToggle.test.tsx`     | Mechanical: `jest.fn` → `vi.fn`, `jest.MockedFunction` → `vi.mocked`. The `vi.mock('@infinum/ui/components/button')` specifier resolves through the alias to the same module id as the component's import.                                                                                                                                                                                                                                                                                                                                                                                                   |
| `frontend/…/TestComponent/TestComponent.test.tsx` | Only needs the imports. It uses `renderServer`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| `frontend/src/lib/i18n/__tests__/utils.test.ts`   | **Known risk.** `safeImportNamespace` recognizes a missing file by `MODULE_NOT_FOUND`, `ERR_MODULE_NOT_FOUND` or `/Cannot find module/`. Under Vite/Vitest, a missing dynamic `import()` fails with a **different message** (for example, `Failed to load url …` or `Unknown variable dynamic import …`), so the two "throws Missing translation namespace" tests will probably fail. Fix: run the test, copy the real message, and add it to the fallback regex in `utils.ts` with a comment. This makes the function robust across bundlers without changing Next.js behavior. Don't weaken the assertion. |
| `ui/…/__tests__/*.test.tsx` (5)                   | Mechanical. They now run in Chromium: any test that relied on a jsdom quirk shows up here. Fix the test, not the component, unless it exposes a real bug.                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `ui/src/utils/__tests__/cn.test.ts`               | Only needs the imports.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |

## 11. Visual regression readiness (PRD Goal 8, R32) — not implemented here

The follow-up can add Vitest 4's browser-mode `expect(...).toMatchScreenshot()` (or `page.screenshot`), either in a Storybook `afterEach` or per story, **without changing tools**. This design already provides:

- Chromium only, headless, at a fixed 1280×720 viewport.
- Stories loading the real Tailwind styles and themes through `preview.ts`.
- A browser cache keyed by Playwright version.

To solve in the follow-up: baselines have to be generated in one reference environment (the Playwright Docker image in CI) because of font and anti-aliasing differences between operating systems. This is the same approach the E2E `*-snapshots` folders already use.

## 12. Implementation plan

The PRD requires one PR (no coexistence on `main`). Build it as the ordered commits below. Each one must leave the branch green for the packages it touches.

| #  | Step                                                                                                                                               | Done when                                                                                                                                                                                                                     |
| -- | -------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 0  | Baseline (§10.1)                                                                                                                                   | The numbers are recorded in the PR draft.                                                                                                                                                                                     |
| 1  | Catalog: add the Vitest/Vite/Storybook-vite packages (§2)                                                                                          | `pnpm install` is clean, and `pnpm why vitest` shows a single 4.1.x.                                                                                                                                                          |
| 2  | `@infinum/configs`: `vitest-config` and `eslint/vitest` (§4)                                                                                       | The exports resolve, and the README is written.                                                                                                                                                                               |
| 3  | `packages/ui` → Vitest browser (§5.2, §10)                                                                                                         | 32/32 cases pass, coverage is in `coverage/ui`, `pnpm --filter @infinum/ui typecheck lint` pass, and the Jest files are deleted.                                                                                              |
| 4  | `apps/frontend` → Vitest jsdom (§5.1, §10)                                                                                                         | 24/24 cases pass, coverage is in `coverage/frontend`, typecheck and lint pass, and the Jest files are deleted.                                                                                                                |
| 5  | Storybook framework switch (§6.1)                                                                                                                  | `dev` and `build` work, themes work visually, and the Docker build passes.                                                                                                                                                    |
| 6  | Story tests and a11y (§6.2–6.4)                                                                                                                    | All stories pass. An injected a11y violation fails with exit code 1. The UI widget runs tests.                                                                                                                                |
| 7  | Signals and pre-push (§5.4, §7)                                                                                                                    | `TEST_REPORT=true` writes the reports, `test:affected` runs a subset, and the fallback paths are tested (see §13).                                                                                                            |
| 8  | Turbo, CI, cache (§8, §9)                                                                                                                          | `coverage.yml` is green with a `storybook` entry in the comment. A second run shows Turbo cache hits and a Chromium cache hit.                                                                                                |
| 9  | Cleanup: remove the Jest deps from the catalog, `eslint-plugin-jest`, `@storybook/nextjs`, the jest-config, the style mocks, and the Jest mentions | `grep -rni jest --exclude-dir=node_modules --exclude=CHANGELOG.md .` only shows `jest-dom`.                                                                                                                                   |
| 10 | Docs and changesets (R42–R43)                                                                                                                      | README, the Development Workflow Guide, Monorepo Structure, the UI Components Guide, the configs README and the "Which test should I write?" guide are updated. Changesets are added for configs, ui, frontend and storybook. |

## 13. Verification checklist (maps to the PRD Success Metrics)

- [ ] `pnpm test` passes 3 times in a row locally and in CI (R31).
- [ ] The per-file case counts match the baseline (R16, R10).
- [ ] Coverage is within ±1% of the baseline for `frontend` and `ui`. The `storybook` entry appears in the job summary and the PR comment (R34, D3.3).
- [ ] An injected a11y violation (for example, a `<button>` with no accessible name in a temporary story) makes `pnpm test` exit with a non-zero code. Revert it afterwards and describe it in the PR.
- [ ] Pre-push with only `packages/ui/src/components/button.tsx` changed runs only the related ui tests and stories (through `test:affected`). It finishes in under 15 s locally.
- [ ] Pre-push with `packages/configs/src/vitest-config/index.mjs` changed runs the full suite.
- [ ] Pre-push with no `origin/main` available (for example, a temporarily renamed remote) falls back to `pnpm test`.
- [ ] Changing a component source file without touching its test **re-runs** that package's tests (no false cache hit).
- [ ] A second `coverage.yml` run with no changes shows `FULL TURBO` / cache hits and `cache-hit=true` for Chromium.
- [ ] `pnpm test:coverage` in CI takes no more than 2× the Jest baseline. Both numbers are in the PR.
- [ ] `pnpm lint`, `typecheck`, `prettier:check`, `check-licenses` and `build` all pass.

## 14. Risks

| Risk                                                                                                                                         | Likelihood | Mitigation                                                                                                                                                            |
| -------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| The `safeImportNamespace` missing-file tests fail because the error message is different                                                     | High       | §10.3: extend the fallback regex in the source, and keep the assertions.                                                                                              |
| `next-intl` ESM resolution fails in Vitest                                                                                                   | Medium     | `server.deps.inline: ['next-intl']` (§5.1). If it still fails, add `next` to the inline list as well.                                                                 |
| `vitest --changed` misses tests that depend on files outside the package root (for example, frontend tests that use ui src through an alias) | Medium     | Check this in §13. If it misses them, `test-affected.sh` should run the full `test` for packages whose dependencies changed. Turbo `--affected` already selects them. |
| Turbo strict env mode hides `HOME`, `PLAYWRIGHT_BROWSERS_PATH` or `GITHUB_ACTIONS`                                                           | Medium     | Add them to `globalPassThroughEnv` (§8).                                                                                                                              |
| `mergeConfig` array concatenation produces unexpected `include` / `coverage.include`                                                         | Medium     | Inspect the resolved config with `vitest --config … --reporter=verbose` or by logging it. Add explicit factory options if needed.                                     |
| Existing stories have real a11y violations                                                                                                   | Medium     | Fix them if it's a small change. Otherwise add a documented `test: 'todo'` opt-out (§6.4).                                                                            |
| Browser startup makes CI too slow                                                                                                            | Low        | The budget is 2×. The browser is cached. The addon docs allow `isolate: false` or sharding for many story tests.                                                      |
| The Storybook addon or framework peers drift (Vitest 5 and Storybook 11)                                                                     | Low        | Everything is pinned in the catalog. Upgrade both together in a follow-up.                                                                                            |

## 15. PRD traceability

| PRD                          | Section in this doc           |
| ---------------------------- | ----------------------------- |
| R1–R5 shared config          | §4                            |
| R6–R12 frontend              | §5.1, §10                     |
| R13–R18 ui                   | §5.2, §10                     |
| R19–R26 storybook            | §6                            |
| R27–R32 signals              | §4.2, §7                      |
| R33–R37 monorepo, CI, cache  | §5.4, §7.1, §8, §9            |
| R38–R43 cleanup, types, docs | §2, §3.2, §12 steps 9–10      |
| D3.1–D3.5                    | §3.1, §6.4, §6.2, §10.3, §4.2 |

## 16. Deviations from design

Changes made during implementation where the sketches above didn't fit the installed packages. Each one is the smallest change that still meets the PRD.

| # | Step | Deviation                                                                                                                                 | Why                                                                                                                                                                                                                                                                                                                                                                           |
| - | ---- | ----------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1 | 1    | Added `peerDependencyRules.allowedVersions: tsconfck>typescript: '6'` to `pnpm-workspace.yaml`.                                           | `tsconfck@3.1.6` (the latest) caps its `typescript` peer at `^5`. The repo is on TypeScript 6 with `strictPeerDependencies: true`, so `pnpm install` failed. It came in through `vite-tsconfig-paths`, and after deviation 4 it still comes in through `@storybook/nextjs-vite` > `vite-plugin-storybook-nextjs` > `vite-tsconfig-paths@5`, so the rule stays.                |
| 2 | 2    | The `.d.mts` uses `ViteUserConfig` instead of `UserConfig`.                                                                               | `vitest/config` in Vitest 4.1 exports Vite's config type as `ViteUserConfig`. It has no `UserConfig` export.                                                                                                                                                                                                                                                                  |
| 3 | 2    | `createTestConfig()` takes an `include` option that replaces `TEST_INCLUDE`.                                                              | `mergeConfig` concatenates arrays (the risk in §4.2 and §14). With `overrides.test.include`, a package that splits into a `jsdom` and a `browser` project ran every test file in both projects, so R2 wasn't met. Checked with a two-project probe: 4 file runs and 2 failures before, 2/2 passing after.                                                                     |
| 4 | 3    | Dropped `vite-tsconfig-paths`. The shared config sets Vite 8's `resolve.tsconfigPaths: true` instead.                                     | With the plugin, every run printed Vite's warning _"The plugin vite-tsconfig-paths is detected. Vite now supports tsconfig paths resolution natively … remove the plugin"_ (noise, R30). The installed Vite wins over the sketch. Checked that the native option resolves both `@/…` and `@infinum/ui/…` from `apps/frontend`, with a negative control that fails without it. |
| 5 | 3    | Renamed `packages/ui/postcss.config.js` to `postcss.config.mjs`.                                                                          | The file uses `export default` in a CommonJS package. Jest never loaded it, but Vite does, and Node printed a `MODULE_TYPELESS_PACKAGE_JSON` warning on every run (R30). `apps/frontend` already uses `postcss.config.mjs`.                                                                                                                                                   |
| 6 | 3    | `@infinum/configs/eslint/typescript` disables type-aware rules for `**/*.{mts,cts}` too (it already did for `js`, `mjs`, `cjs`).          | `typescript-eslint`'s type-checked presets apply to `.mts`, but no package tsconfig includes `vitest.config.mts`, so `eslint` crashed with a parser-services error. The configs are type-checked once by hand with `tsc --ignoreConfig`.                                                                                                                                      |
| 7 | 3    | Deleted `packages/ui/tsconfig.jest.json` (not listed in §3.2).                                                                            | It only exists for Jest (`types: ["jest", …]`), and R39 requires removing Jest config files.                                                                                                                                                                                                                                                                                  |
| 8 | 3    | ui coverage totals are not within ±1% of the Jest baseline (lines 82.47% → 75.67%). Agreed with the requester to keep V8 and document it. | Jest used its default `babel` (istanbul) provider in ui, and V8 counts differently: a multi-line JSX return is 1 line, and implicit branches at line 1 count as branches. Per file, exactly the same code is covered (every tested file at 100% lines/statements/functions under both, `example.tsx` and `tooltip.tsx` at 0% under both).                                     |
