import { getServerSession as getNextAuthServerSession, NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

const MOCK_USER = {
	id: '1',
	name: 'John Doe',
	email: 'john@example.com',
	hashedPassword: 'hashedPassword',
	role: 'user',
};

const findUserByEmail = (_email: string) => {
	return MOCK_USER;
};
const verifyPassword = (_password: string, _hashedPassword: string) => {
	return true;
};

export const authOptions: NextAuthOptions = {
	session: {
		strategy: 'jwt',
	},
	secret: process.env.NEXTAUTH_SECRET,
	providers: [
		CredentialsProvider({
			name: 'Credentials',
			credentials: {
				email: { label: 'Email', type: 'email' },
				password: { label: 'Password', type: 'password' },
			},
			async authorize(credentials) {
				if (!credentials?.email || !credentials?.password) {
					throw new Error('Missing username or password');
				}

				const user = await findUserByEmail(credentials.email);
				if (!user) {
					// Remember to never leak if there's actually a user with given email, always show the end-user "Invalid password" error!
					throw new Error('User not found');
				}

				const isValid = await verifyPassword(credentials.password, user.hashedPassword);
				if (!isValid) {
					throw new Error('Invalid password');
				}

				// Return a "safe" user object. NextAuth will store this in JWT token
				return {
					id: user.id,
					name: user.name,
					email: user.email,
					// User role used by CASL
					role: user.role,
				};
			},
		}),
	],
	callbacks: {
		jwt({ token, user }) {
			// If `user` is defined, it means we're in the process of the user signing in
			if (user) {
				token.user = user;
			}
			return token;
		},
		session({ session, token }) {
			// Add the user role to the session for CASL
			if (session.user && token) {
				session.user = token.user;
			}
			return session;
		},
	},
	// Optionally, add pages if you want custom error or signIn pages
	// pages: {
	//   signIn: '/login',
	//   error: '/login?error=CredentialsSignin', // example
	// },
};

// For better reusability, encapsulate the session logic in a separate hook
export const getServerSession = () => getNextAuthServerSession(authOptions);
