import baseConfig from '@infinum/configs/eslint/base';
import typescriptConfig from '@infinum/configs/eslint/typescript';
import reactConfig from '@infinum/configs/eslint/react';
import vitestConfig from '@infinum/configs/eslint/vitest';
import storybookConfig from '@infinum/configs/eslint/storybook';

export default [
	...baseConfig,
	...typescriptConfig,
	...reactConfig,
	...vitestConfig,
	...storybookConfig,
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
