import pluginJs from '@eslint/js';
import pluginPrettier from 'eslint-plugin-prettier/recommended';
import globals from 'globals';

export default [
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
	{
		ignores: [
			'**/node_modules',
			'**/dist',
			'**/build',
			'**/.turbo',
			'**/storybook-static',
			'**/.next',
			'**/coverage',
			'public/**',
		],
	},
];
