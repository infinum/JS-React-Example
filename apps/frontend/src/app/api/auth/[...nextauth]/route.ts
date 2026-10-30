import { authOptions } from '@/lib/auth';
import NextAuth from 'next-auth';

// next-auth v4 types NextAuth() as `any`. In the App Router it returns a route handler.
const handler = NextAuth(authOptions) as (
	request: Request,
	context: { params: Promise<{ nextauth: string[] }> }
) => Promise<Response>;

export { handler as GET, handler as POST };
