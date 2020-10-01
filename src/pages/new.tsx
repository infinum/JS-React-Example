import Head from 'next/head';
import { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

import { NewListContainer } from 'components/containers/NewListContainer';
import { withAuth } from 'components/withAuth';

function Home(): ReactElement {
	const { t } = useTranslation();

	return (
		<>
			<Head>
				<title>{t('newList')}</title>
			</Head>
			<NewListContainer />
		</>
	);
}

export default withAuth(Home);
