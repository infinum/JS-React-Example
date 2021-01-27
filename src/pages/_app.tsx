import { ChakraProvider } from '@chakra-ui/react';
import type { AppProps } from 'next/app';
import { ReactElement, useMemo } from 'react';
import theme from '@themes/default';
import { DatxProvider } from '@datx/jsonapi-react';

import { createClient } from '../network/client';
import { DatxDevTools } from '../components/utilities/DatxDevTools/DatxDevTools';

// const client = createClient();

function App({ Component, pageProps }: AppProps): ReactElement {
	const client = useMemo(createClient, []);

	return (
		<DatxProvider client={client}>
			<ChakraProvider theme={theme} resetCSS>
				<Component {...pageProps} />
				<DatxDevTools />
			</ChakraProvider>
		</DatxProvider>
	);
}

export default App;
