import React, { ReactElement } from 'react';
import type { AppProps } from 'next/app';
import { ChakraProvider } from '@chakra-ui/react';

import theme from '@/styles/theme';
import { Fonts } from '@/styles/Fonts';

import 'focus-visible/dist/focus-visible';

function ExampleApp({ Component, pageProps }: AppProps): ReactElement {
	return (
		<ChakraProvider theme={theme}>
			<Fonts />
			<Component {...pageProps} />
		</ChakraProvider>
	);
}

export default ExampleApp;
