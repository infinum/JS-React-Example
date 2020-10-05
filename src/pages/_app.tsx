import { Provider } from 'mobx-react';
import { AppProps } from 'next/app';
import { ReactElement, useEffect } from 'react';
import { ThemeProvider } from 'emotion-theming';

import { HeaderContainer } from 'components/containers/HeaderContainer';
import { initializeStore, useStore } from 'store';
import { getCurrentUser } from 'utils/fetchers';
import '../localisation/localisation';
import { GlobalStyles, theme } from 'theming/Theme';

function MyApp({ Component, pageProps }: AppProps): ReactElement {
	const store = useStore(pageProps.initialState);

	// TODO: Fix the datx-network useHook
	// TODO: This needs to be done before render
	useEffect(() => {
		getCurrentUser.fetch();
	}, []);

	return (
		<ThemeProvider theme={theme}>
			<GlobalStyles />

			<Provider store={store}>
				<div>
					<HeaderContainer />
					<main>
						<Component {...pageProps} />
					</main>
				</div>
			</Provider>
		</ThemeProvider>
	);
}

MyApp.getServerSideProps = async (): Promise<object> => {
	const store = initializeStore();
	await getCurrentUser.fetch();

	return { initialState: store.snapshot };
};

export default MyApp;
