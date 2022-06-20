import '@datx/core/disable-mobx';

import React, { ReactElement } from 'react';
import type { AppProps } from 'next/app';
import { ChakraProvider } from '@chakra-ui/react';
import { createFetcher, DatxProvider, useInitialize } from '@datx/swr';
import { createClient } from '../datx/createClient';
import { appWithTranslation } from 'next-i18next';
import { SWRConfig } from 'swr';
import nextI18nConfig from '../../next-i18next.config';

import theme from '@/styles/theme';
import { Fonts } from '@/styles/Fonts';

import 'focus-visible/dist/focus-visible';

function ExampleApp({ Component, pageProps }: AppProps): ReactElement {
	const client = useInitialize(createClient);

	return (
		<DatxProvider client={client}>
			<ChakraProvider theme={theme}>
				<SWRConfig
					value={{
						fetcher: createFetcher(client),
					}}
				>
					<Fonts />
					<Component {...pageProps} />
				</SWRConfig>
			</ChakraProvider>
		</DatxProvider>
	);
}

export default appWithTranslation(ExampleApp, nextI18nConfig);
