import { validateEnvironmentVariables } from './lib/env/validate-env';

export function register() {
	validateEnvironmentVariables();
}
