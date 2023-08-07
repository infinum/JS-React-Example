import { ChakraProvider } from '@chakra-ui/react';
import { DatxProvider, createFetcher, useInitialize } from '@datx/swr';
import { RenderOptions, render } from '@testing-library/react';
import i18n from 'i18next';
import { FC, ReactElement, ReactNode } from 'react';
import { I18nextProvider, initReactI18next } from 'react-i18next';
import { SWRConfig } from 'swr';

import { createClient } from '@/datx/create-client';
import { server } from '@/mocks/server';
import theme from '@/styles/theme';
import { MockedRequest, matchRequestUrl } from 'msw';
import common from '../public/locales/en-US/common.json';

i18n.use(initReactI18next).init({
	lng: 'en-US',
	fallbackLng: 'en-US',
	ns: ['common'],
	defaultNS: 'common',
	resources: { 'en-US': { common } },
});

interface IComponentWithChildrenProps {
	children?: ReactNode;
}

const AllProvidersFactory = (Wrapper?: RenderOptions['wrapper']): FC<IComponentWithChildrenProps> =>
	function AllProviders({ children }) {
		const client = useInitialize(createClient);

		const content = (
			<I18nextProvider i18n={i18n}>
				<DatxProvider client={client}>
					<SWRConfig value={{ provider: () => new Map(), fetcher: createFetcher(client) }}>
						<ChakraProvider theme={theme}>{children}</ChakraProvider>
					</SWRConfig>
				</DatxProvider>
			</I18nextProvider>
		);

		return Wrapper ? <Wrapper>{content}</Wrapper> : content;
	};

const customRender = (ui: ReactElement, options?: RenderOptions) =>
	render(ui, { wrapper: AllProvidersFactory(options?.wrapper), ...options });

// re-export everything
export * from '@testing-library/react';

// override render method
export { customRender as render };

export function waitForRequest(method: string, url: string) {
	let requestId = '';

	return new Promise<MockedRequest>((resolve, reject) => {
		server.events.on('request:start', (req) => {
			if (req.method.toLowerCase() !== method.toLowerCase()) {
				return;
			}

			if (!matchRequestUrl(req.url, url).matches) {
				return;
			}

			requestId = req.id;
		});

		server.events.on('request:match', (req) => {
			if (req.id === requestId) {
				resolve(req);
			}
		});

		server.events.on('request:unhandled', (req) => {
			if (req.id === requestId) {
				reject(new Error(`The ${req.method} ${req.url.href} request was unhandled.`));
			}
		});
	});
}

waitForRequest.get = (url: string) => waitForRequest('get', url);
waitForRequest.post = (url: string) => waitForRequest('post', url);
