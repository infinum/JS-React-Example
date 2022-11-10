const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

const path = require('path');
const toPath = (_path) => path.join(process.cwd(), _path);

module.exports = {
	core: {
		builder: 'webpack5',
	},
	stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.(js|jsx|ts|tsx)', '../src/**/stories.(js|jsx|ts|tsx)'],
	addons: [
		'@storybook/addon-a11y',
		'@storybook/addon-links',
		'@storybook/addon-essentials',
		'storybook-addon-next-router',
		'@chakra-ui/storybook-addon',
	],
	typescript: {
		reactDocgen: false,
	},
	features: {
		emotionAlias: false,
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

		config.module.rules.push({
			test: /\.mjs$/,
			include: /node_modules/,
			type: 'javascript/auto',
		});

		return {
			...config,
			resolve: {
				...config.resolve,
				fallback: {
					fs: false,
					path: false,
				},
				plugins: [
					...(config.resolve.plugins || []),
					new TsconfigPathsPlugin({
						extensions: config.resolve.extensions,
					}),
				],
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
	env: (config) => ({
		...config,
		__NEXT_NEW_LINK_BEHAVIOR: JSON.stringify(true),
	}),
};
