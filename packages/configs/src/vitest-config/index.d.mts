import type { ViteUserConfig } from 'vitest/config';

export type TestEnvironment = 'jsdom' | 'browser';

export interface CreateTestConfigOptions {
	/** Package short name, used for `coverage/<name>` and `test-results/<name>` at the repo root. */
	name: string;
	/** `jsdom` runs in Node with a simulated DOM, `browser` runs in headless Chromium. */
	environment: TestEnvironment;
	/** Replaces `TEST_INCLUDE`. Use it to split one package into projects per environment (`overrides` would concatenate). */
	include?: string[];
	/** Replaces the coverage `include` list. Default: all `.ts`/`.tsx` files in `src`. */
	coverageInclude?: string[];
	/** Coverage thresholds, or `false` to only report. Default: 7% for branches, functions, lines and statements. */
	coverageThresholds?: { branches?: number; functions?: number; lines?: number; statements?: number } | false;
	/** Merged last with Vite's `mergeConfig`, so a package can override anything. Arrays are concatenated. */
	overrides?: ViteUserConfig;
}

export function createTestConfig(options: CreateTestConfigOptions): ViteUserConfig;

export const TEST_INCLUDE: string[];
export const COVERAGE_EXCLUDE: string[];
export const BROWSER_VIEWPORT: { width: number; height: number };
