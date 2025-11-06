import 'server-only';

import { envsafe, str } from 'envsafe';

/**
 * Validates the client environment variables.
 * Call this as early as possible in your client startup (currently instrumentation.ts) to guarantee you never run
 * a client instance with misconfigured or missing environment variables.
 *
 * Since this is a server-only file (due to the 'server-only' import and *.server.ts extension),
 * we can use the process.env object directly and not worry about bundling it into the client build.
 *
 * @returns The validated client environment variables.
 */
export const secretEnv = () =>
	envsafe({
		NEXTAUTH_SECRET: str({
			input: process.env.NEXTAUTH_SECRET,
			devDefault: 'REPLACE_ME',
			desc: 'A secure random string used by NextAuth for signing and encrypting JWT tokens and cookies. Required in production, especially when using JWT sessions.',
			docs: 'https://next-auth.js.org/configuration/options#nextauth_secret',
		}),
	});
