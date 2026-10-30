import pluginJs from '@eslint/js';
import pluginPrettier from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';

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
		},
	},
	{
		// TypeScript only shows deprecations as editor hints, `tsc` never reports them. tsconfig.json lists the files.
		files: ['**/*.{js,mjs,cjs}'],
		languageOptions: {
			parser: tseslint.parser,
			parserOptions: {
				projectService: {
					// TypeScript leaves a .mjs out of the program when a .d.mts with the same name sits next to it
					allowDefaultProject: ['src/vitest-config/index.mjs'],
				},
				tsconfigRootDir: import.meta.dirname,
			},
		},
		plugins: { '@typescript-eslint': tseslint.plugin },
		rules: {
			'@typescript-eslint/no-deprecated': 'error',
		},
	},
	{
		ignores: ['**/node_modules', '**/dist', '**/build', '**/coverage', '**/.next', '**/.turbo', '**/storybook-static'],
	},
];
