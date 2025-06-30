// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from 'eslint-plugin-storybook';
import pluginJs from '@eslint/js';
import pluginJest from 'eslint-plugin-jest';
import pluginPrettier from 'eslint-plugin-prettier/recommended';
import pluginNext from '@next/eslint-plugin-next';
import pluginReact from 'eslint-plugin-react';
import pluginReactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import { fixupPluginRules } from '@eslint/compat';

export default tseslint.config(
	{
		ignores: ['**/node_modules', '**/dist', '**/build', '**/coverage', '**/.next', '**/.turbo', '**/storybook-static'],
	},
	{
		languageOptions: {
			globals: { ...globals.browser, ...globals.node },
			parserOptions: {
				project: ['./tsconfig.eslint.json', './packages/**/tsconfig.json', './apps/**/tsconfig.json'],
				tsconfigRootDir: import.meta.dirname,
			},
		},
	},
	...tseslint.configs.stylisticTypeChecked,
	pluginPrettier,
	{
		rules: {
			'no-console': ['warn', { allow: ['warn', 'error', 'info', 'debug'] }],
			'no-debugger': 'error',
			'no-return-await': 'error',
			'require-await': 'error',
			'@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', ignoreRestSiblings: true }],
		},
	},
	{
		files: ['**/*.{js,mjs,cjs}'],
		...pluginJs.configs.recommended,
		...tseslint.configs.disableTypeChecked,
	},
	{
		files: ['**/*.test.ts'],
		...pluginJest.configs['flat/recommended'],
	},
	{
		files: ['**/*.tsx'],
		settings: {
			react: {
				version: 'detect',
			},
		},
		plugins: {
			react: pluginReact,
			'react-hooks': fixupPluginRules(pluginReactHooks),
			'@next/next': pluginNext,
		},
		rules: {
			...pluginReact.configs['jsx-runtime'].rules,
			...pluginReactHooks.configs.recommended.rules,
			...pluginNext.configs.recommended.rules,
			...pluginNext.configs['core-web-vitals'].rules,
			'@next/next/no-html-link-for-pages': 'off',
			'@next/next/no-duplicate-head': 'off',
		},
	},
	storybook.configs['flat/recommended']
);
