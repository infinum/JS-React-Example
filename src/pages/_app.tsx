import React, { ReactElement } from 'react';
import type { AppProps } from 'next/app';
import { ChakraProvider } from '@chakra-ui/react';
import { DatxProvider } from '@datx/jsonapi-react';
import { appWithTranslation } from 'next-i18next';

import theme from '@/styles/theme';
import { Fonts } from '@/styles/Fonts';
import client from '@/store';

import 'focus-visible/dist/focus-visible';
import '@/store/utils/config';

function ExampleApp({ Component, pageProps }: AppProps): ReactElement {
	return (
		<DatxProvider client={client}>
			<ChakraProvider theme={theme}>
				<Fonts />
				<Component {...pageProps} />
			</ChakraProvider>
		</DatxProvider>
	);
}

export default appWithTranslation(ExampleApp);
