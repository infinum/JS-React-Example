import { ChakraProvider } from '@chakra-ui/react';
import type { AppProps } from 'next/app';
import { ReactElement } from 'react';
import theme from '@themes/default';
import getConfig from 'next/config';
import { SWRConfig } from 'swr';

import '../datx/config';

import { DatxProvider, compare } from '../libs/datx';
import { createDatx } from '../datx/createDatx';

const { publicRuntimeConfig } = getConfig();

function App({ Component, pageProps }: AppProps): ReactElement {
	const datx = createDatx();

	return (
		<DatxProvider value={datx}>
			<SWRConfig
				value={{
					fetcher: datx.fetcher,
					compare,
				}}
			>
				<ChakraProvider theme={theme} resetCSS>
					{publicRuntimeConfig.DUMMY}
					<Component {...pageProps} />
				</ChakraProvider>
			</SWRConfig>
		</DatxProvider>
	);
}

export default App;
