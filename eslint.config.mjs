import { fixupPluginRules } from '@eslint/compat';
import pluginJs from '@eslint/js';
import pluginNext from '@next/eslint-plugin-next';
import pluginJest from 'eslint-plugin-jest';
import pluginPrettier from 'eslint-plugin-prettier/recommended';
import pluginReact from 'eslint-plugin-react';
import pluginReactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default [
	{
		ignores: ['**/node_modules', '**/.next', '**/coverage', 'public/**', 'next-env.d.ts'],
	},
	{
		languageOptions: {
			globals: { ...globals.browser, ...globals.node },
		},
	},
	pluginPrettier,
	{
		rules: {
			'no-console': ['warn', { allow: ['warn', 'error', 'info', 'debug'] }],
			'no-debugger': 'error',
			'no-return-await': 'error',
			'require-await': 'error',
		},
	},
	{
		files: ['**/*.{js,mjs,cjs}'],
		...pluginJs.configs.recommended,
	},

	// TypeScript
	...tseslint.configs.stylisticTypeChecked,
	{
		files: ['**/*.ts', '**/*.tsx'],
		languageOptions: {
			parserOptions: {
				projectService: true,
				tsconfigRootDir: import.meta.dirname,
			},
		},
		rules: {
			'@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', ignoreRestSiblings: true }],
		},
	},
	{
		files: ['**/*.{js,mjs,cjs}'],
		...tseslint.configs.disableTypeChecked,
	},

	// React
	{
		files: ['**/*.tsx', '**/*.jsx'],
		settings: {
			react: {
				version: 'detect',
			},
		},
		plugins: {
			react: pluginReact,
			'react-hooks': fixupPluginRules(pluginReactHooks),
		},
		rules: {
			...pluginReact.configs['jsx-runtime'].rules,
			...pluginReactHooks.configs.recommended.rules,
		},
	},

	// Next.js
	{
		files: ['**/*.tsx', '**/*.jsx'],
		plugins: {
			'@next/next': pluginNext,
		},
		rules: {
			...pluginNext.configs.recommended.rules,
			...pluginNext.configs['core-web-vitals'].rules,
		},
	},

	// Jest
	{
		files: ['**/*.test.ts', '**/*.test.tsx'],
		...pluginJest.configs['flat/recommended'],
	},
];
