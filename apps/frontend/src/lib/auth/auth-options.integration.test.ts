import type { Account, Session, User } from 'next-auth';
import type { JWT } from 'next-auth/jwt';
import { describe, expect, it } from 'vitest';
import { authOptions } from './auth-options';

type Credentials = Record<'email' | 'password', string>;
type Authorize = (credentials: Credentials | undefined, request: unknown) => Promise<User | null>;

// CredentialsProvider keeps the app's `authorize` under `options`
const { authorize } = (authOptions.providers[0] as unknown as { options: { authorize: Authorize } }).options;
const { jwt, session } = authOptions.callbacks!;

const signIn = (credentials?: Credentials) =>
	authorize(credentials, { body: credentials, query: {}, headers: {}, method: 'POST' });

describe('auth options', () => {
	describe('credentials sign-in', () => {
		it('returns the user for valid credentials', async () => {
			const user = await signIn({ email: 'john@example.com', password: 'secret' });

			expect(user).toEqual({ id: '1', name: 'John Doe', email: 'john@example.com', role: 'user' });
		});

		it('never returns the password hash', async () => {
			const user = await signIn({ email: 'john@example.com', password: 'secret' });

			expect(user).not.toHaveProperty('hashedPassword');
		});

		it('rejects a wrong password', async () => {
			await expect(signIn({ email: 'john@example.com', password: 'invalid' })).rejects.toThrow('Invalid password');
		});

		it('rejects missing credentials', async () => {
			await expect(signIn()).rejects.toThrow('Missing username or password');
			await expect(signIn({ email: 'john@example.com', password: '' })).rejects.toThrow('Missing username or password');
		});
	});

	describe('session', () => {
		it('carries the signed-in user, role included, from the token into the session', async () => {
			const user = (await signIn({ email: 'john@example.com', password: 'secret' }))!;

			const token = await jwt!({ token: {} as JWT, user, account: {} as Account });
			const result = (await session!({
				session: { user: { name: 'John Doe' }, expires: '2099-01-01T00:00:00.000Z' } as Session,
				token,
				user: { ...user, emailVerified: null },
				newSession: undefined,
				trigger: 'update',
			})) as Session;

			expect(result.user).toEqual({ id: '1', name: 'John Doe', email: 'john@example.com', role: 'user' });
		});

		it('keeps the user in the token on later requests, when no user is passed', async () => {
			const token = { user: { id: '1', name: 'John Doe', email: 'john@example.com', role: 'user' } } as JWT;

			const result = await jwt!({ token, user: undefined as unknown as User, account: null });

			expect(result).toBe(token);
		});
	});
});
