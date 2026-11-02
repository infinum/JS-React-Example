import path from 'node:path';
import { includeIgnoreFile } from 'eslint/config';
import tseslint from 'typescript-eslint';
import baseConfig from '@infinum/configs/eslint/base';

export default [
	// Skip gitignored files (local agent plans, build output...) like the rest of the tooling does
	includeIgnoreFile(path.join(import.meta.dirname, '.gitignore')),
	...baseConfig,
	{
		// TypeScript only shows deprecations as editor hints, `tsc` never reports them. tsconfig.json lists the files.
		files: ['**/*.{js,mjs,cjs}'],
		languageOptions: {
			parser: tseslint.parser,
			parserOptions: {
				projectService: true,
				tsconfigRootDir: import.meta.dirname,
			},
		},
		plugins: { '@typescript-eslint': tseslint.plugin },
		rules: {
			'@typescript-eslint/no-deprecated': 'error',
		},
	},
];
