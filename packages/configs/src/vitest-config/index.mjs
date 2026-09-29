import path from 'node:path';
import react from '@vitejs/plugin-react';
import { playwright } from '@vitest/browser-playwright';
import tsconfigPaths from 'vite-tsconfig-paths';
import { configDefaults, defineConfig, mergeConfig } from 'vitest/config';

// Files that count as tests
export const TEST_INCLUDE = ['**/__tests__/**/*.{ts,tsx,js}', '**/*.{test,spec}.{ts,tsx,js}'];
const TEST_EXCLUDE = [...configDefaults.exclude, '**/*.e2e.spec.*', '**/*.stories.*', '**/__stories__/**'];

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

/** @type {import('./index.d.mts').createTestConfig} */
export function createTestConfig({ name, environment, include = TEST_INCLUDE, overrides = {} }) {
	const base = defineConfig({
		plugins: [tsconfigPaths(), react()],
		test: {
			include,
			exclude: TEST_EXCLUDE,
			passWithNoTests: true,
			// Reset mocks and stubs between tests, so tests don't depend on each other's order
			clearMocks: true,
			unstubGlobals: true,
			unstubEnvs: true,
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
				include: ['src/**/*.{ts,tsx}'],
				exclude: COVERAGE_EXCLUDE,
				thresholds: { branches: 7, functions: 7, lines: 7, statements: 7 },
			},
		},
	});

	return mergeConfig(mergeConfig(base, presets[environment]), overrides);
}
