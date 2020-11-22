const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

const path = require('path');
const toPath = (_path) => path.join(process.cwd(), _path);

module.exports = {
	stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)', '../src/**/stories.@(js|jsx|ts|tsx)'],
	addons: [
		'storybook-addon-performance/register',
		'@storybook/addon-a11y',
		'@storybook/addon-links',
		'@storybook/addon-essentials',
	],
	typescript: {
		reactDocgen: false,
	},
	refs: {
		'design-system': {
			title: 'Chakra UI',
			url: 'https://chakra-ui.netlify.app',
		},
	},
	webpackFinal: async (config) => {
		return {
			...config,
			resolve: {
				...config.resolve,
				plugins: [...config.resolve.plugins, new TsconfigPathsPlugin()],
				alias: {
					...config.resolve.alias,
					'@emotion/core': toPath('node_modules/@emotion/react'),
					'emotion-theming': toPath('node_modules/@emotion/react'),
				},
			},
		};
	},
};
