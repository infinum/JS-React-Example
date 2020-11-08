import { ChakraProvider } from '@chakra-ui/core';
import type { AppProps } from 'next/app';
import { ReactElement } from 'react';
import theme from '@themes/default';

function App({ Component, pageProps }: AppProps): ReactElement {
	return (
		<ChakraProvider theme={theme} resetCSS>
			<Component {...pageProps} />
		</ChakraProvider>
	);
}

export default App;
