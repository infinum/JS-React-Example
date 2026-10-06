import baseConfig from '@infinum/configs/eslint/base';
import typescriptConfig from '@infinum/configs/eslint/typescript';
import reactConfig from '@infinum/configs/eslint/react';
import nextConfig from '@infinum/configs/eslint/nextjs';
import vitestConfig from '@infinum/configs/eslint/vitest';

export default [
	...baseConfig,
	...typescriptConfig,
	...reactConfig,
	...nextConfig,
	...vitestConfig,
	{
		files: ['**/*.ts', '**/*.tsx'],
		languageOptions: {
			parserOptions: {
				project: ['./tsconfig.eslint.json'],
				tsconfigRootDir: import.meta.dirname,
			},
		},
	},
];
