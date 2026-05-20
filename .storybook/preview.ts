import type { Preview } from '@storybook/nextjs';

import theme from '../src/styles/theme';

const preview: Preview = {
	parameters: {
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/i,
			},
		},
		chakra: {
			theme,
		},
	},
};

export default preview;
