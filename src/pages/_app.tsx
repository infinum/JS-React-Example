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

const gtHaptik = localFont({
	src: [
		{ path: '../assets/fonts/GT-Haptik-Regular.woff', weight: '400', style: 'normal' },
		{ path: '../assets/fonts/GT-Haptik-Bold.woff', weight: '700', style: 'normal' },
	],
});

interface IExampleAppProps extends AppProps {
	err: Error;
}

function ExampleApp({ Component, pageProps, err }: IExampleAppProps) {
	// disabled since `useInitialize` won't trigger a re-render
	// eslint-disable-next-line @infinum/no-hooks-in-pages-folder
	const client = useInitialize(createClient);

	return (
		<DatxProvider client={client}>
			{/* eslint-disable-next-line react/no-unknown-property */}
			<style jsx global>
				{`
					:root {
						--font-haptik: ${gtHaptik.style.fontFamily};
					}
				`}
			</style>
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
