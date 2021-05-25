import { withPerformance } from 'storybook-addon-performance';
import { withNextRouter } from 'storybook-addon-next-router';
import { initializeWorker, mswDecorator } from 'msw-storybook-addon';

import { withThemeProvider } from './withThemeProvider';
import { withDatxProvider } from './withDatxProvider';

import 'focus-visible/dist/focus-visible';

initializeWorker();

export const decorators = [
	mswDecorator,
	withDatxProvider,
	withThemeProvider,
	withPerformance,
	withNextRouter({
		path: '/',
		asPath: '/',
		query: {},
		push() {},
		replace() {},
	}),
];

export const parameters = {
	actions: { argTypesRegex: '^on[A-Z].*' },
	controls: {
		matchers: {
			color: /(background|color)$/i,
			date: /Date$/,
		},
	},
};

export const globalTypes = {
	theme: {
		name: 'Theme',
		description: 'Select a Theme',
		defaultValue: 'default',
		toolbar: {
			icon: 'paintbrush',
			items: [{ value: 'default', title: 'Default Theme' }],
		},
	},
};
