import { secretEnv } from '../../../../lib/env/validate-env.server';
import { AuthCard } from '../_components/AuthCard/AuthCard';
import { LoginForm } from '../_components/LoginForm/LoginForm';

export default function LoginPage() {
	const serverVars = secretEnv();
	const secret = serverVars.TEST_SECRET;

	return (
		<AuthCard>
			<LoginForm />
			<code>{secret}</code>
		</AuthCard>
	);
}
