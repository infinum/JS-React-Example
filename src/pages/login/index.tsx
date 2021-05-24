import React from 'react';
import { NextPage } from 'next';
import { Heading } from '@chakra-ui/react';

import { LoginForm } from '@/components/shared/auth/LoginForm/LoginForm';
import { useSession } from '@/hooks/useSession';
import { AuthLayout } from '@/components/shared/layouts/AuthLayout/AuthLayout';

const Login: NextPage = () => {
	useSession({ redirectIfFound: true, redirectTo: '/' });

	return (
		<AuthLayout>
			<Heading as="h1" mb={16}>
				Login
			</Heading>
			<LoginForm />
		</AuthLayout>
	);
};

export default Login;
