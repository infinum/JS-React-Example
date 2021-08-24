import React from 'react';
import { NextPage } from 'next';
import { Heading } from '@chakra-ui/react';

import { LoginForm } from '@/components/shared/auth/LoginForm/LoginForm';
import { AuthLayout } from '@/components/shared/layouts/AuthLayout/AuthLayout';
import { AuthRedirect } from '@/components/shared/utilities/AuthRedirect/AuthRedirect';

const Login: NextPage = () => {
	return (
		<AuthLayout>
			<AuthRedirect to="/" ifFound />

			<Heading as="h1" mb={16}>
				Login
			</Heading>

			<LoginForm />
		</AuthLayout>
	);
};

export default Login;
