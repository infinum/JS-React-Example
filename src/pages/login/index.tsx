import React from 'react';
import { NextPage } from 'next';
import { Heading, Link, Text } from '@chakra-ui/react';
import NextLink from 'next/link';

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
			<Text as="p" mt={8}>
				Don't have an account?{' '}
				<NextLink href="/register" passHref>
					<Link>Register</Link>
				</NextLink>
			</Text>
		</AuthLayout>
	);
};

export default Login;
