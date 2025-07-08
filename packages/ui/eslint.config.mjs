import baseConfig from '@infinum/configs/eslint/base';
import typescriptConfig from '@infinum/configs/eslint/typescript';
import reactConfig from '@infinum/configs/eslint/react';
import jestConfig from '@infinum/configs/eslint/jest';
import storybookConfig from '@infinum/configs/eslint/storybook';

export default [
	...baseConfig,
	...typescriptConfig,
	...reactConfig,
	...jestConfig,
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
