import React from 'react';
import { NextPage } from 'next';

import { LoginForm } from '@/components/shared/auth/LoginForm/LoginForm';
import { useSession } from '@/hooks/useSession';

const Login: NextPage = () => {
	useSession({ redirectIfFound: true, redirectTo: '/' });

	return (
		<div>
			<h1>login</h1>
			<LoginForm />
		</div>
	);
};

export default Login;
