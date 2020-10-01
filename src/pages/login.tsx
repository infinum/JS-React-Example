import Head from 'next/head';
import { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

import { LoginContainer } from 'components/containers/LoginContainer';

export default function Login(): ReactElement {
	const { t } = useTranslation();

	return (
		<>
			<Head>
				<title>{t('logIn')}</title>
			</Head>
			<LoginContainer />
		</>
	);
}
