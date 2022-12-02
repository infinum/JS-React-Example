import React from 'react';
import { NextPage, GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { Login } from '@/components/features/login/Login/Login';
import { AuthLayout } from '@/components/shared/layouts/AuthLayout/AuthLayout';
import { AuthRedirect } from '@/components/shared/utilities/AuthRedirect/AuthRedirect';
import { getSafeLocale } from '@/utils/locale';

const LoginPage: NextPage = () => {
	return (
		<AuthLayout>
			<AuthRedirect to="/" ifFound />
			<Login />
		</AuthLayout>
	);
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
	return {
		props: {
			...(await serverSideTranslations(getSafeLocale(locale), ['common', 'login', 'loginForm'])),
		},
	};
};

export default LoginPage;
