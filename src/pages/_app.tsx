import { Global, css } from '@emotion/core';
import type { AppProps } from 'next/app';
import { ReactElement } from 'react';

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
`;

function MyApp({ Component, pageProps }: AppProps): ReactElement {
	return (
		<>
			<Global styles={globalStyles} />
			<Component {...pageProps} />
		</>
	);
}

export default MyApp;
