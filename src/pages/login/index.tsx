import React from 'react';
import { NextPage, GetStaticProps } from 'next';
import { Heading } from '@chakra-ui/react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';

import { LoginForm } from '@/components/shared/auth/LoginForm/LoginForm';
import { AuthLayout } from '@/components/shared/layouts/AuthLayout/AuthLayout';
import { AuthRedirect } from '@/components/shared/utilities/AuthRedirect/AuthRedirect';

const Login: NextPage = () => {
	const { t } = useTranslation('login');

	return (
		<AuthLayout>
			<AuthRedirect to="/" ifFound />

			<Heading as="h1" mb={16}>
				{t('heading')}
			</Heading>

			<LoginForm />
		</AuthLayout>
	);
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
	return {
		props: {
			...(await serverSideTranslations(locale, ['common', 'login'])),
		},
	};
};


export default Login;
