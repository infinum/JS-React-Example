import type { StorybookConfig } from '@storybook/nextjs';

const config: StorybookConfig = {
	stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
	addons: [
		'@storybook/addon-links',
		'@storybook/addon-essentials',
		'@storybook/addon-onboarding',
		'@storybook/addon-interactions',
		'@storybook/addon-a11y',
		'@chakra-ui/storybook-addon',
		'@chromatic-com/storybook',
	],
	framework: {
		name: '@storybook/nextjs',
		options: {},
	},
	typescript: {
		reactDocgen: 'react-docgen-typescript',
	},
};
export default config;
