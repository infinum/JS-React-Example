import React from 'react';
import { NextPage, GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';

import { Login } from '@/components/features/login/Login/Login';
import { AuthLayout } from '@/components/shared/layouts/AuthLayout/AuthLayout';
import { AuthRedirect } from '@/components/shared/utilities/AuthRedirect/AuthRedirect';

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
			...(await serverSideTranslations(locale, ['common', 'login', 'loginForm'])),
		},
	};
};

export default LoginPage;
