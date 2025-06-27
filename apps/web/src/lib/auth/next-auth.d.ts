/// <reference types="next-auth" />

import type { DefaultSession, DefaultUser } from 'next-auth';
import type { DefaultJWT } from 'next-auth/jwt';

type AppUser = DefaultUser & {
	id: string;
	name: string;
	email: string;
	role: string;
};

declare module 'next-auth' {
	interface User extends AppUser {
		// Strictly override the base type "string | null | undefined" with "string"
		name: string;
		email: string;
	}

	interface Session extends DefaultSession {
		user: AppUser;
	}
}

declare module 'next-auth/jwt' {
	interface JWT extends DefaultJWT {
		user: AppUser;
	}
}
