import Head from 'next/head';
import { ReactElement } from 'react';

import { LoginContainer } from 'components/containers/LoginContainer';

export default function Login(): ReactElement {
	return (
		<>
			<Head>
				<title>Log in</title>
			</Head>
			<LoginContainer />
		</>
	);
}
