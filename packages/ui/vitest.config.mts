import { createTestConfig } from '@infinum/configs/vitest';

export default createTestConfig({
	name: 'ui',
	environment: 'browser',
	// Ratchet: the floor of the current coverage. Raise it when coverage goes up, never lower it to make a run pass.
	coverageThresholds: { statements: 77, lines: 75, branches: 70, functions: 81 },
	overrides: {
		test: {
			setupFiles: ['./src/tests/vitest.setup.ts'],
		},
	},
});
