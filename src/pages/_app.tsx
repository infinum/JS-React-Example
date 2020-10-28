import { ChakraProvider } from '@chakra-ui/core';
import type { AppProps } from 'next/app';
import { ReactElement } from 'react';

function App({ Component, pageProps }: AppProps): ReactElement {
	return (
		<ChakraProvider resetCSS>
			<Component {...pageProps} />
		</ChakraProvider>
	);
}

export default App;
