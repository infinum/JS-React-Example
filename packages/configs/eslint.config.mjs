import pluginJs from '@eslint/js';
import pluginPrettier from 'eslint-plugin-prettier/recommended';
import globals from 'globals';

export default [
	{
		languageOptions: {
			globals: { ...globals.browser, ...globals.node },
		},
	},
	pluginJs.configs.recommended,
	pluginPrettier,
	{
		rules: {
			'no-console': ['warn', { allow: ['warn', 'error', 'info', 'debug'] }],
			'no-debugger': 'error',
			'no-return-await': 'error',
		},
	},
	{
		ignores: ['**/node_modules', '**/dist', '**/build', '**/coverage', '**/.next', '**/.turbo', '**/storybook-static'],
	},
];
