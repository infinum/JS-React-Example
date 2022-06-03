import { withPerformance } from 'storybook-addon-performance';
import { RouterContext } from 'next/dist/shared/lib/router-context';
import { initializeWorker, mswDecorator } from 'msw-storybook-addon';

import { withThemeProvider } from './withThemeProvider';
import { withDatxProvider } from './withDatxProvider';

import 'focus-visible/dist/focus-visible';

initializeWorker();

export const decorators = [mswDecorator, withDatxProvider, withThemeProvider, withPerformance];

export const parameters = {
	actions: { argTypesRegex: '^on[A-Z].*' },
	controls: {
		matchers: {
			color: /(background|color)$/i,
			date: /Date$/,
		},
	},
	nextRouter: {
		Provider: RouterContext.Provider,
		path: '/',
		asPath: '/',
		query: {},
		push() {},
		replace() {},
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
