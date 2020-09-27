import Head from 'next/head';
import { ReactElement } from 'react';

import { HomeContainer } from 'components/containers/HomeContainer';
import { withAuth } from 'components/withAuth';

function Home(): ReactElement {
	return (
		<>
			<Head>
				<title>Todos</title>
			</Head>
			<HomeContainer />
		</>
	);
}

export default withAuth(Home);
