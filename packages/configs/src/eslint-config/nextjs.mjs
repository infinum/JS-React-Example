import pluginNext from '@next/eslint-plugin-next';

export default [
	{
		files: ['**/*.tsx', '**/*.jsx'],
		plugins: {
			'@next/next': pluginNext,
		},
		rules: {
			...pluginNext.configs.recommended.rules,
			...pluginNext.configs['core-web-vitals'].rules,
			'@next/next/no-html-link-for-pages': 'off',
			'@next/next/no-duplicate-head': 'off',
		},
	},
	{
		ignores: ['**/.next', '**/*.d.json.ts', 'next-env.d.ts'],
	},
];
