import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';

export default [
	{
		// The core recommended rules. The typescript-eslint configs below turn off the ones TypeScript already checks.
		files: ['**/*.{ts,tsx,mts,cts}'],
		...pluginJs.configs.recommended,
	},
	// Type-aware correctness rules (no-floating-promises, no-misused-promises, no-unsafe-*...)
	...tseslint.configs.recommendedTypeChecked,
	...tseslint.configs.stylisticTypeChecked,
	{
		files: ['**/*.ts', '**/*.tsx'],
		rules: {
			'@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', ignoreRestSiblings: true }],
		},
	},
	{
		// Config files (eslint.config.mjs, vitest.config.mts...) are linted with type information too, but only for
		// no-deprecated below: the other type-aware rules would flag every untyped import in plain JavaScript
		files: ['**/*.{js,mjs,cjs,mts,cts}'],
		rules: tseslint.configs.disableTypeChecked.rules,
	},
	{
		// TypeScript only shows deprecations as editor hints, `tsc` never reports them
		rules: {
			'@typescript-eslint/no-deprecated': 'error',
		},
	},
	{
		// CommonJS config files (.prettierrc.js) load their shared config with require()
		files: ['**/*.{js,cjs}'],
		rules: {
			'@typescript-eslint/no-require-imports': 'off',
		},
	},
];
