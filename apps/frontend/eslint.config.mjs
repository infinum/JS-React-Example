import baseConfig from '@infinum/configs/eslint/base';
import typescriptConfig from '@infinum/configs/eslint/typescript';
import importConfig from '@infinum/configs/eslint/import';
import reactConfig from '@infinum/configs/eslint/react';
import nextConfig from '@infinum/configs/eslint/nextjs';
import vitestConfig from '@infinum/configs/eslint/vitest';

export default [
	...baseConfig,
	...typescriptConfig,
	...importConfig,
	...reactConfig,
	...nextConfig,
	...vitestConfig,
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
