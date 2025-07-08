import type { StorybookConfig } from '@storybook/nextjs';

import { dirname, join } from 'path';

/**
 * This function is used to resolve the absolute path of a package.
 * It is needed in projects that use Yarn PnP or are set up within a monorepo.
 */
function getAbsolutePath(value: string): any {
	return dirname(require.resolve(join(value, 'package.json')));
}
const config: StorybookConfig = {
	stories: [
		'../src/stories/**/*.mdx',
		'../src/stories/**/*.stories.@(js|jsx|mjs|ts|tsx)',
		'../../../packages/ui/src/**/*.stories.@(js|jsx|mjs|ts|tsx)',
	],
	addons: ['@storybook/addon-themes', '@storybook/addon-docs', '@storybook/addon-a11y', '@storybook/addon-designs'],
	framework: {
		name: getAbsolutePath('@storybook/nextjs'),
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
