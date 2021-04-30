import React, { ReactElement } from 'react';
import type { AppProps } from 'next/app';
import { ChakraProvider } from '@chakra-ui/react';
import { DatxProvider } from '@datx/jsonapi-react';

import theme from '../styles/theme';
import { Fonts } from '../styles/Fonts';
import client from '../store';

import '../store/utils/config';

function MyApp({ Component, pageProps }: AppProps): ReactElement {
	return (
		<DatxProvider client={client}>
			<ChakraProvider theme={theme}>
				<Fonts />
				<Component {...pageProps} />
			</ChakraProvider>
		</DatxProvider>
	);
}

export default MyApp;
