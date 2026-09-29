import type { StorybookConfig } from '@storybook/nextjs-vite';

const config: StorybookConfig = {
	stories: [
		'../src/stories/**/*.mdx',
		'../src/stories/**/*.stories.@(js|jsx|mjs|ts|tsx)',
		'../../../packages/ui/src/**/*.stories.@(js|jsx|mjs|ts|tsx)',
	],
	addons: [
		'@storybook/addon-themes',
		'@storybook/addon-docs',
		'@storybook/addon-a11y',
		'@storybook/addon-designs',
		'@storybook/addon-mcp',
	],
	framework: {
		name: '@storybook/nextjs-vite',
		options: {},
	},
	core: {
		disableTelemetry: true,
	},
	features: {
		backgrounds: false, // 👈 disable the backgrounds feature since we're using themes
	},
	docs: {
		defaultName: 'Docs',
	},
};

export default config;
