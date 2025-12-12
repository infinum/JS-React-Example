import pluginPlaywright from 'eslint-plugin-playwright';

export default [
	{
		files: ['**/*.e2e.{spec,test}.{js,mjs,cjs,ts,tsx}'],
		...pluginPlaywright.configs['flat/recommended'],
	},
];
