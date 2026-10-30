import path from 'node:path';
import react from '@vitejs/plugin-react';
import { playwright } from '@vitest/browser-playwright';
import { configDefaults, defineConfig, mergeConfig } from 'vitest/config';

// Files that count as tests
export const TEST_INCLUDE = ['**/__tests__/**/*.{ts,tsx,js}', '**/*.{test,spec}.{ts,tsx,js}'];
const TEST_EXCLUDE = [...configDefaults.exclude, '**/*.e2e.spec.*', '**/*.stories.*', '**/__stories__/**'];

// Integration tests: several modules wired together in plain Node.js, no DOM and no setup-file mocks
export const INTEGRATION_TEST_INCLUDE = ['**/*.integration.test.ts'];

export const COVERAGE_EXCLUDE = [
	'src/**/*.d.ts',
	'src/**/*.{test,spec}.{ts,tsx}',
	'src/**/*.stories.{ts,tsx}',
	'src/**/__tests__/**',
	'src/**/__stories__/**',
	'src/tests/**',
];

// Same viewport as the Playwright E2E base config, so future screenshots match
export const BROWSER_VIEWPORT = { width: 1280, height: 720 };

const repoRoot = path.resolve(import.meta.dirname, '../../../..');

// Opt-in machine-readable output (TEST_REPORT=true), next to the default terminal output
const machineReporters = (name) =>
	process.env.TEST_REPORT === 'true'
		? [
				['json', { outputFile: path.join(repoRoot, 'test-results', name, 'results.json') }],
				['junit', { outputFile: path.join(repoRoot, 'test-results', name, 'junit.xml') }],
			]
		: [];

const presets = {
	jsdom: { test: { environment: 'jsdom' } },
	node: { test: { environment: 'node' } },
	browser: {
		test: {
			node: { test: { environment: 'node' } },
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

/** @type {import('./index.d.mts').createTestConfig} */
export function createTestConfig({
	name,
	environment,
	include = TEST_INCLUDE,
	coverageInclude = ['src/**/*.{ts,tsx}'],
	coverageThresholds = { branches: 7, functions: 7, lines: 7, statements: 7 },
	integration = false,
	overrides = {},
}) {
	// `pnpm test:coverage:changed` sets this to a git ref: report coverage of the files changed since then only.
	// Thresholds are for whole packages, so they don't apply to that subset.
	const coverageChanged = process.env.COVERAGE_CHANGED;
	const thresholds = coverageChanged ? false : coverageThresholds;

	const project = (projectEnvironment, test) =>
		mergeConfig(
			defineConfig({
				plugins: [react()],
				// Resolve the `paths` aliases from the package's tsconfig.json (built into Vite 8)
				resolve: { tsconfigPaths: true },
				test: {
					exclude: TEST_EXCLUDE,
					// Reset mocks and stubs between tests, so tests don't depend on each other's order
					clearMocks: true,
					unstubGlobals: true,
					unstubEnvs: true,
					...test,
				},
			}),
			presets[projectEnvironment]
		);

	const base = defineConfig({
		test: {
			passWithNoTests: true,
			reporters: [process.env.GITHUB_ACTIONS ? 'github-actions' : null, 'default', ...machineReporters(name)].filter(
				Boolean
			),
			// A change to any of these makes `--changed` run the whole suite
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
				include: coverageInclude,
				exclude: COVERAGE_EXCLUDE,
				...(coverageChanged ? { changed: coverageChanged } : {}),
				...(thresholds ? { thresholds } : {}),
			},
		},
	});

	if (!integration) {
		return mergeConfig(mergeConfig(base, project(environment, { include })), overrides);
	}

	// Two projects: `unit` in the package's environment, with `overrides` (setup files...), and `integration` in Node,
	// with the config `integration` holds when it's an object
	return mergeConfig(base, {
		test: {
			projects: [
				mergeConfig(
					project(environment, { name: 'unit', include, exclude: [...TEST_EXCLUDE, ...INTEGRATION_TEST_INCLUDE] }),
					overrides
				),
				mergeConfig(
					project('node', { name: 'integration', include: INTEGRATION_TEST_INCLUDE }),
					integration === true ? {} : integration
				),
			],
		},
	});
}
