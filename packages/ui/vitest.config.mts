import { createTestConfig } from '@infinum/configs/vitest';

export default createTestConfig({
	name: 'ui',
	environment: 'browser',
	overrides: {
		test: {
			setupFiles: ['./src/tests/vitest.setup.ts'],
		},
	},
});
