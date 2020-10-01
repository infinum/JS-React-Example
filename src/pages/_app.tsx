import { Global, css } from '@emotion/core';
import { Provider } from 'mobx-react';
import { AppProps } from 'next/app';
import { ReactElement, useEffect } from 'react';

import { HeaderContainer } from 'components/containers/HeaderContainer';
import { initializeStore, useStore } from 'store';
import { getCurrentUser } from 'utils/fetchers';
import '../localisation/Localisation';

const globalStyles = css`
	html,
	body {
		padding: 0;
		margin: 0;
		font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans,
			Helvetica Neue, sans-serif;
	}

	a {
		color: inherit;
		text-decoration: none;
	}

	* {
		box-sizing: border-box;
	}

	header a {
		margin-right: 10px;
	}
`;

function MyApp({ Component, pageProps }: AppProps): ReactElement {
	const store = useStore(pageProps.initialState);

	// TODO: Fix the datx-network useHook
	// TODO: This needs to be done before render
	useEffect(() => {
		getCurrentUser.fetch();
	}, []);

	return (
		<Provider store={store}>
			<Global styles={globalStyles} />
			<div>
				<HeaderContainer />
				<main>
					<Component {...pageProps} />
				</main>
			</div>
		</Provider>
	);
}

MyApp.getServerSideProps = async (): Promise<object> => {
	const store = initializeStore();
	await getCurrentUser.fetch();

	return { initialState: store.snapshot };
};

export default MyApp;
