import { useRouter } from 'next/router';
import { ReactElement, useState } from 'react';

import { LoginForm } from 'components/ui/LoginForm';
import { login } from 'utils/fetchers';

export const LoginContainer = (): ReactElement => {
	const router = useRouter();
	const [apiErrors, setApiErrors] = useState<string>();

	const onSubmit = async ({ email, password }: { email: string; password: string }): Promise<void> => {
		try {
			await login.fetch(null, { email, password });
			setApiErrors(null);
			router.push('/');
		} catch (e) {
			setApiErrors(e.error?.message);
		}
	};

	return (
		<>
			<LoginForm onSubmit={onSubmit} apiErrors={apiErrors} />
		</>
	);
};
