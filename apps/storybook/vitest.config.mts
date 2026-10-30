import path from 'node:path';
import { createTestConfig } from '@infinum/configs/vitest';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';

export default createTestConfig({
	name: 'storybook',
	environment: 'browser',
	// The Storybook plugin finds the stories from .storybook/main.ts and warns when `include` is set
	include: [],
	// Stories render the packages/ui components, so measure those files. The pattern starts with `**/`
	// on purpose: it matches the ui files that stories load, but Vitest doesn't list ui files that no story
	// loads, because it can't transform files outside this package's root.
	coverageInclude: ['**/packages/ui/src/**/*.{ts,tsx}'],
	// Ratchet: the floor of the current coverage. Raise it when coverage goes up, never lower it to make a run pass.
	coverageThresholds: { statements: 100, lines: 100, branches: 66, functions: 100 },
	overrides: {
		// Turns every story into a test: render, play function and a11y checks
		plugins: [storybookTest({ configDir: path.join(import.meta.dirname, '.storybook') })],
		test: {
			coverage: {
				allowExternal: true,
			},
		},
	},
});
