import typescriptConfig from '@infinum/configs/eslint/typescript';

export default [
	...typescriptConfig,
	{
		languageOptions: {
			parserOptions: {
				project: './tsconfig.json',
				tsconfigRootDir: import.meta.dirname,
			},
		},
	},
	{
		ignores: ['.prettierrc.js', 'eslint.config.mjs', 'postcss.config.js', 'postcss.config.mjs'],
	},
];
