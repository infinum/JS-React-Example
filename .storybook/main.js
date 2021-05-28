const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

const path = require('path');
const toPath = (_path) => path.join(process.cwd(), _path);

module.exports = {
	stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.(js|jsx|ts|tsx)', '../src/**/stories.(js|jsx|ts|tsx)'],
	addons: ['@storybook/addon-a11y', '@storybook/addon-links', '@storybook/addon-essentials'],
	typescript: {
		reactDocgen: false,
	},
	webpackFinal: async (config) => {
		// Remove default svg file loader
		const rules = config.module.rules.map((rule) => {
			if (rule.test.test('.svg')) {
				rule.test = new RegExp(rule.test.toString().replace('svg|', ''));
				return rule;
			} else {
				return rule;
			}
		});

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
			module: {
				rules: [
					...rules,
					{
						test: /\.svg$/,
						exclude: /node_modules/,
						use: {
							loader: 'svg-react-loader',
						},
					},
				],
			},
		};
	},
};
