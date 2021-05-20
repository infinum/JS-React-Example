import { useState } from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { Provider } from 'mobx-react';
import { withPerformance } from 'storybook-addon-performance';
import { withNextRouter } from 'storybook-addon-next-router';
import { initializeWorker, mswDecorator } from 'msw-storybook-addon';
import { SWRConfig, cache } from 'swr';

import { generateStore } from '@/utils/generateStore';
import { swrComparator as compare } from '@/utils/swr';

import 'focus-visible/dist/focus-visible';
import { chakraDefault } from '@/styles/themes/default';
import { GlobalStyles } from '@/styles/global';
import '../src/i18n';

initializeWorker();

const withProviders = (StoryFn: Function) => {
	const [store] = useState(() => generateStore());

	console.log('clear swr cache!!!');
	cache.clear();

	return (
		<Provider store={store}>
			<SWRConfig value={{ fetcher: store?.fetcher, compare }}>
				<ChakraProvider theme={chakraDefault}>
					<GlobalStyles />
					<div id="story-wrapper" style={{ minHeight: '100vh' }}>
						<StoryFn />
					</div>
				</ChakraProvider>
			</SWRConfig>
		</Provider>
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
