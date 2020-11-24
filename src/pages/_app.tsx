import { ChakraProvider } from '@chakra-ui/react';
import type { AppProps } from 'next/app';
import { ReactElement } from 'react';
import theme from '@themes/default';
import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();

function App({ Component, pageProps }: AppProps): ReactElement {
	return (
		<ChakraProvider theme={theme} resetCSS>
			{publicRuntimeConfig.DUMMY}
			<Component {...pageProps} />
		</ChakraProvider>
	);
}

export default App;
