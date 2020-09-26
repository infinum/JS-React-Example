import { Global, css } from '@emotion/core';
import { Provider } from 'mobx-react';
import { AppProps } from 'next/app';
import { ReactElement } from 'react';

import { User } from 'models/User';
import { initializeStore, useStore } from 'store';
import { debug } from 'utils/debugger';
import * as fetchers from 'utils/fetchers';
import Link from 'next/link';

debug('fetchers', fetchers);

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

	const isLoggedIn = store.findAll(User).length !== 0;

	return (
		<Provider store={store}>
			<Global styles={globalStyles} />
			<div>
				<header>
					<Link href="/">
						<a>Home</a>
					</Link>
					{isLoggedIn ? (
						'Logout'
					) : (
						<Link href="/login">
							<a>Log in</a>
						</Link>
					)}
				</header>
				<main>
					<Component {...pageProps} />
				</main>
			</div>
		</Provider>
	);
}

export default MyApp;

export async function getInitialProps(): Promise<object> {
	const store = initializeStore();

	try {
		await fetchers.getCurrentUser.fetch();
	} catch {
		// Nothing to do here
	}

	return { props: { initialState: store.snapshot } };
}
