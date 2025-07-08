import { CUSTOM_VIEWPORTS } from '@/src/constants/custom-viewports';
import { loadThemeStyles } from '@/src/utils/loadThemeStyles';
import { withThemeByClassName } from '@storybook/addon-themes';
import type { Preview } from '@storybook/nextjs';
import { MINIMAL_VIEWPORTS } from 'storybook/viewport';
import '../src/lib/tailwind/index.css';

loadThemeStyles();

const preview: Preview = {
	tags: ['autodocs'],
	parameters: {
		viewport: {
			options: {
				...CUSTOM_VIEWPORTS,
				...MINIMAL_VIEWPORTS,
			},
		},
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/i,
			},
		},
		layout: 'centered',
	},
	decorators: [
		withThemeByClassName({
			themes: { Default: 'default', Dark: 'dark', Rainbow: 'rainbow' },
			defaultTheme: 'Default',
		}),
	],
	globalTypes: {
		theme: {
			description: 'Global theme for components',
			defaultValue: 'Default',
		},
	},
};

export default preview;
