import type { StorybookConfig } from '@storybook/nextjs';

const config: StorybookConfig = {
	stories: [
		'../src/stories/**/*.mdx',
		'../src/stories/**/*.stories.@(js|jsx|mjs|ts|tsx)',
		'../../../packages/ui/src/**/*.stories.@(js|jsx|mjs|ts|tsx)',
	],
	addons: ['@storybook/addon-themes', '@storybook/addon-docs', '@storybook/addon-a11y', '@storybook/addon-designs'],
	framework: {
		name: '@storybook/nextjs',
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
