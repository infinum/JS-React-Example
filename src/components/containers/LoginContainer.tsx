import React, { ReactElement } from 'react';

import { LoginForm } from 'components/ui/LoginForm';
import { login } from 'utils/fetchers';

export const LoginContainer = (): ReactElement => {
	const [apiErrors, setApiErrors] = React.useState<string>();

	const onSubmit = ({ email, password }: { email: string; password: string }): void => {
		login.fetch(null, { email, password }).then(
			() => setApiErrors(null),
			(e) => setApiErrors(e.error?.message)
		);
	};

	return (
		<>
			<LoginForm onSubmit={onSubmit} apiErrors={apiErrors} />
		</>
	);
};
