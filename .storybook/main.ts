import type { StorybookConfig } from '@storybook/nextjs';

const config: StorybookConfig = {
	stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
	addons: [
		'@storybook/addon-links',
		'@storybook/addon-onboarding',
		'@storybook/addon-a11y',
		'@chakra-ui/storybook-addon',
		'@chromatic-com/storybook',
		'@storybook/addon-docs',
	],
	framework: {
		name: '@storybook/nextjs',
		options: {},
	},
	typescript: {
		reactDocgen: 'react-docgen-typescript',
	},
	webpackFinal: async (config) => {
		config.resolve ??= {};
		config.resolve.alias = {
			...config.resolve.alias,
			'@chakra-ui/react/extend-theme': require.resolve('@chakra-ui/react'),
		};

		return config;
	},
};
export default config;
