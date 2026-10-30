import vitest from '@vitest/eslint-plugin';

export default [
	{
		files: ['**/*.test.ts', '**/*.test.tsx', '**/__tests__/**/*.{ts,tsx}'],
		...vitest.configs.recommended,
		rules: {
			...vitest.configs.recommended.rules,
			// Never commit focused tests (.only)
			'vitest/no-focused-tests': 'error',
			'vitest/no-disabled-tests': 'warn',
		},
	},
	{
		ignores: ['**/coverage', '**/test-results'],
	},
];
