import { createTestConfig } from '@infinum/configs/vitest';

export default createTestConfig({
	name: 'frontend',
	environment: 'jsdom',
	overrides: {
		test: {
			setupFiles: ['./src/tests/vitest.setup.tsx'],
			// next-intl imports 'next/navigation' without an extension. Inlining it lets Vite resolve that import.
			server: { deps: { inline: ['next-intl'] } },
		},
	},
});
