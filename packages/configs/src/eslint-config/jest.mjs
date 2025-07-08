import pluginJest from 'eslint-plugin-jest';

export default [
	{
		files: ['**/*.test.ts', '**/*.test.tsx'],
		...pluginJest.configs['flat/recommended'],
	},
	{
		ignores: ['**/coverage'],
	},
];
