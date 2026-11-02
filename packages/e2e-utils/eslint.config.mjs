import baseConfig from '@infinum/configs/eslint/base';
import playwrightConfig from '@infinum/configs/eslint/playwright';
import typescriptConfig from '@infinum/configs/eslint/typescript';

export default [
	...baseConfig,
	...typescriptConfig,
	...playwrightConfig,
	{
		// Config files included: no-deprecated needs type information everywhere
		files: ['**/*.{ts,tsx,mts,cts,js,mjs,cjs}'],
		languageOptions: {
			parserOptions: {
				project: './tsconfig.json',
				tsconfigRootDir: import.meta.dirname,
			},
		},
	},
];
