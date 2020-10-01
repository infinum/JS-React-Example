import Head from 'next/head';
import { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

import { HomeContainer } from 'components/containers/HomeContainer';
import { withAuth } from 'components/withAuth';

function Home(): ReactElement {
	const { t } = useTranslation();

	return (
		<>
			<Head>
				<title>{t('todos')}</title>
			</Head>
			<HomeContainer />
		</>
	);
}

export default withAuth(Home);
