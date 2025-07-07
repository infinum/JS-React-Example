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
		files: ['**/*.{js,mjs,cjs}'],
		...tseslint.configs.disableTypeChecked,
	},
];
