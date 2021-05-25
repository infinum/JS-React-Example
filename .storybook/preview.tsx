import { ChakraProvider } from '@chakra-ui/react';
import { withPerformance } from 'storybook-addon-performance';
import { withNextRouter } from 'storybook-addon-next-router';
import { initializeWorker, mswDecorator } from 'msw-storybook-addon';
import { cache } from 'swr';
import { DatxProvider } from '../src/libs/@datx/jsonapi-react';

import theme from '../src/styles/theme';
import { Fonts } from '../src/styles/Fonts';
import client from '../src/store';

import 'focus-visible/dist/focus-visible';

initializeWorker();

const withProviders = (StoryFn: Function) => {
	cache.clear();

	console.log('story');

	return (
		<DatxProvider client={client}>
			<ChakraProvider theme={theme}>
				<Fonts />
				<StoryFn />
			</ChakraProvider>
		</DatxProvider>
	);
};

export const decorators = [
	mswDecorator,
	withProviders,
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
