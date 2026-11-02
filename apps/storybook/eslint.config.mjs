import baseConfig from '@infinum/configs/eslint/base';
import typescriptConfig from '@infinum/configs/eslint/typescript';
import importConfig from '@infinum/configs/eslint/import';
import reactConfig from '@infinum/configs/eslint/react';
import vitestConfig from '@infinum/configs/eslint/vitest';
import storybookConfig from '@infinum/configs/eslint/storybook';

export default [
	...baseConfig,
	...typescriptConfig,
	...importConfig,
	...reactConfig,
	...vitestConfig,
	...storybookConfig,
	{
		// Config files included: no-deprecated needs type information everywhere
		files: ['**/*.{ts,tsx,mts,cts,js,mjs,cjs}'],
		languageOptions: {
			parserOptions: {
				projectService: true,
				tsconfigRootDir: import.meta.dirname,
			},
		},
	},
];
