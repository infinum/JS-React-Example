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
import { matchRequestUrl } from 'msw';
import common from '../public/locales/en-US/common.json';

// eslint-disable-next-line @typescript-eslint/no-floating-promises
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
	let reqId = '';

	return new Promise<Request>((resolve, reject) => {
		server.events.on('request:start', ({ request, requestId }) => {
			if (request.method.toLowerCase() !== method.toLowerCase()) {
				return;
			}

			if (!matchRequestUrl(new URL(request.url), url).matches) {
				return;
			}

			reqId = requestId;
		});

		server.events.on('request:match', ({ request, requestId }) => {
			if (requestId === reqId) {
				resolve(request);
			}
		});

		server.events.on('request:unhandled', ({ request, requestId }) => {
			if (requestId === reqId) {
				const url = new URL(request.url);

				reject(new Error(`The ${request.method} ${url.href} request was unhandled.`));
			}
		});
	});
}

waitForRequest.get = (url: string) => waitForRequest('get', url);
waitForRequest.post = (url: string) => waitForRequest('post', url);
