import { createTestConfig } from '@infinum/configs/vitest';

// next-intl and next-public-env import files without an extension (e.g. 'next/navigation'). Inlining them lets
// Vite resolve those imports.
const inlineNextIntl = { server: { deps: { inline: ['next-intl', 'next-public-env'] } } };

export default createTestConfig({
	name: 'frontend',
	environment: 'jsdom',
	// Ratchet: the floor of the current coverage. Raise it when coverage goes up, never lower it to make a run pass.
	coverageThresholds: { statements: 51, lines: 51, branches: 63, functions: 42 },
	// `*.integration.test.ts` files run in plain Node, without the jsdom setup file below
	integration: { test: inlineNextIntl },
	overrides: {
		test: {
			setupFiles: ['./src/tests/vitest.setup.tsx'],
			...inlineNextIntl,
		},
	},
});
