import { ChakraProvider } from '@chakra-ui/react';
import type { AppProps } from 'next/app';
import { ReactElement } from 'react';
import theme from '@themes/default';
import { SWRConfig } from 'swr';

import 'datx/disable-mobx';
import '../datx/config';

import { DatxProvider, compare } from '../libs/datx';
import { createDatx } from '../datx/createDatx';

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
					<Component {...pageProps} />
				</ChakraProvider>
			</SWRConfig>
		</DatxProvider>
	);
}

export default App;
