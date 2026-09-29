import tseslint from 'typescript-eslint';

export default [
	{
		files: ['**/*.ts', '**/*.tsx'],
		rules: {
			'@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', ignoreRestSiblings: true }],
		},
	},
	...tseslint.configs.stylisticTypeChecked,
	{
		// Config files (eslint.config.mjs, vitest.config.mts) aren't part of any tsconfig project
		files: ['**/*.{js,mjs,cjs,mts,cts}'],
		...tseslint.configs.disableTypeChecked,
	},
];
