import { fixupPluginRules } from '@eslint/compat';
import pluginReact from 'eslint-plugin-react';
import pluginReactHooks from 'eslint-plugin-react-hooks';

export default [
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
];
