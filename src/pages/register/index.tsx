import React from 'react';
import { NextPage } from 'next';
import { Heading, Link, Text } from '@chakra-ui/react';
import NextLink from 'next/link';

import { useSession } from '@/hooks/useSession';
import { AuthLayout } from '@/components/shared/layouts/AuthLayout/AuthLayout';
import { RegisterForm } from '@/components/shared/auth/RegisterForm/RegisterForm';

const Register: NextPage = () => {
	useSession({ redirectIfFound: true, redirectTo: '/' });

	return (
		<AuthLayout>
			<Heading as="h1" mb={16}>
				Register
			</Heading>
			<RegisterForm />
			<Text as="p" mt={8}>
				Already have an account?{' '}
				<NextLink href="/login" passHref>
					<Link>Login</Link>
				</NextLink>
			</Text>
		</AuthLayout>
	);
};

export default Register;
