import '@datx/core/disable-mobx';

import type { AppProps } from 'next/app';
import { ChakraProvider } from '@chakra-ui/react';
import { appWithTranslation } from 'next-i18next';
import { createFetcher, DatxProvider, useInitialize } from '@datx/swr';
import { SWRConfig } from 'swr';
import localFont from 'next/font/local';

import { createClient } from '@/datx/create-client';
import { start } from '@/lib/bugsnag';
import theme from '@/styles/theme';
import nextI18nConfig from '../../next-i18next.config';

import 'focus-visible/dist/focus-visible';

start();

if (process.env.NEXT_PUBLIC_API_MOCKING === 'enabled') {
	require('../mocks');
}

const gtHaptik = localFont({
	src: [
		{ path: '../assets/fonts/GT-Haptik-Regular.woff', weight: '400', style: 'normal' },
		{ path: '../assets/fonts/GT-Haptik-Bold.woff', weight: '700', style: 'normal' },
	],
});

theme.fonts.body = gtHaptik.style.fontFamily;
theme.fonts.heading = gtHaptik.style.fontFamily;

interface IExampleAppProps extends AppProps {
	err: Error;
}

function ExampleApp({ Component, pageProps, err }: IExampleAppProps) {
	const client = useInitialize(createClient);

	return (
		<DatxProvider client={client}>
			<ChakraProvider theme={theme}>
				<SWRConfig
					value={{
						fetcher: createFetcher(client),
					}}
				>
					{/* Pass err as a workaround for https://github.com/vercel/next.js/issues/8592 */}
					<Component {...pageProps} err={err} />
				</SWRConfig>
			</ChakraProvider>
		</DatxProvider>
	);
}

export default appWithTranslation(ExampleApp, nextI18nConfig);
