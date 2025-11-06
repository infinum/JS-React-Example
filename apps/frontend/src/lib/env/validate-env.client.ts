import { envsafe, str } from 'envsafe';

/**
 * Validates the client environment variables.
 * Call this as early as possible in your client startup (currently instrumentation.ts) to guarantee you never run
 * a client instance with misconfigured or missing environment variables.
 *
 * Do not use this function directly in your client code, use the getPublicEnv() function instead.
 *
 * Make sure to pass "default" values so that during Docker build, the variables are not missing, but will be
 * overridden at runtime.
 *
 * @returns The validated client environment variables.
 */
export const publicEnv = () =>
	envsafe({
		NODE_ENV: str({
			input: process.env.NODE_ENV,
			choices: ['development', 'test', 'production'],
			devDefault: 'development',
		}),

		NEXTAUTH_URL: str({
			input: process.env.NEXTAUTH_URL,
			default: 'http://localhost:3000',
			desc: 'When deploying to production, set the NEXTAUTH_URL environment variable to the canonical URL of your site.',
			docs: 'https://next-auth.js.org/configuration/options#nextauth_url',
		}),

		API_BASE_URL: str({
			input: process.env.API_BASE_URL,
			default: 'http://localhost:3000/api',
			desc: 'Base URL for API requests, available on both server and client via runtime env system',
		}),
	});
