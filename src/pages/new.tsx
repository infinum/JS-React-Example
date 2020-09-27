import Head from 'next/head';
import { ReactElement } from 'react';

import { NewListContainer } from 'components/containers/NewListContainer';
import { withAuth } from 'components/withAuth';

function Home(): ReactElement {
	return (
		<>
			<Head>
				<title>New list</title>
			</Head>
			<NewListContainer />
		</>
	);
}

export default withAuth(Home);
