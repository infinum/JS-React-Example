import baseConfig from '@infinum/configs/eslint/base';
import playwrightConfig from '@infinum/configs/eslint/playwright';
import typescriptConfig from '@infinum/configs/eslint/typescript';

export default [
	...baseConfig,
	...typescriptConfig,
	...playwrightConfig,
	{
		files: ['**/*.ts', '**/*.tsx'],
		languageOptions: {
			parserOptions: {
				project: './tsconfig.json',
				tsconfigRootDir: import.meta.dirname,
			},
		},
	},
];
