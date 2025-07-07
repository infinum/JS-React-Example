import { envsafe, str } from 'envsafe';

/**
 * Validates the environment variables and returns them.
 *
 * This is used in instrumentation.ts file, and overrides the next-runtime-env env() function declaration.
 *
 * DO NOT use exported envsafe values, or it's functionalities like defaultValue, etc.
 * Handling environment variables should only be done with next-runtime-env env() function.
 *
 */
export const validateEnvironmentVariables = () => {
	const env = envsafe({
		// Common
		NODE_ENV: str({
			input: process.env.NODE_ENV,
			choices: ['development', 'test', 'production'],
		}),
		// NextAuth
		NEXTAUTH_SECRET: str({
			input: process.env.NEXTAUTH_SECRET,
			desc: 'A secure random string used by NextAuth for signing and encrypting JWT tokens and cookies. Required in production, especially when using JWT sessions.',
		}),
		// Example variables
		NEXT_PUBLIC_EXAMPLE_VARIABLE: str({
			input: process.env.NEXT_PUBLIC_EXAMPLE_VARIABLE,
			allowEmpty: true,
		}),
		PRIVATE_EXAMPLE_VARIABLE: str({
			input: process.env.PRIVATE_EXAMPLE_VARIABLE,
		}),
	});

	console.info('✅ Environment variables validated.');

	return env;
};
