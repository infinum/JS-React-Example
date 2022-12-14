import { initializeWorker, mswDecorator } from 'msw-storybook-addon';

import theme from '../src/styles/theme';

import { withDatxProvider } from './withDatxProvider';

initializeWorker();

export const decorators = [mswDecorator, withDatxProvider];

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
	chakra: {
		theme,
	},
};
