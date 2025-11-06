import { publicEnv } from './lib/env/validate-env.client';
import { secretEnv } from './lib/env/validate-env.server';

const validateEnv = () => {
	publicEnv();
	secretEnv();
};

export function register() {
	validateEnv();
}
