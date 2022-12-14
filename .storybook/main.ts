const path = require('path');

/** @type {import('@storybook/types')} */
module.exports = {
	stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
	addons: [
		'@storybook/addon-links',
		'@storybook/addon-essentials',
		'@storybook/addon-interactions',
		'@storybook/addon-a11y',
		'@chakra-ui/storybook-addon',
	],
	framework: {
		name: '@storybook/nextjs',
		/** @type {import('@storybook/nextjs').FrameworkOptions} */
		options: {},
	},
	docs: {
		docsPage: true,
	},
};
