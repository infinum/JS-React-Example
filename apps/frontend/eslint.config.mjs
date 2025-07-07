import baseConfig from '@infinum/configs/eslint/base';
import typescriptConfig from '@infinum/configs/eslint/typescript';
import reactConfig from '@infinum/configs/eslint/react';
import nextConfig from '@infinum/configs/eslint/nextjs';
import jestConfig from '@infinum/configs/eslint/jest';

export default [
	...baseConfig,
	...typescriptConfig,
	...reactConfig,
	...nextConfig,
	...jestConfig,
	{
		files: ['**/*.ts', '**/*.tsx'],
		languageOptions: {
			parserOptions: {
				project: ['./tsconfig.json'],
				tsconfigRootDir: import.meta.dirname,
			},
		},
	},
];
