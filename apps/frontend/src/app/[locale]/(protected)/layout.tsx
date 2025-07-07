import { getServerSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { ReactNode } from 'react';

export default async function ProtectedLayout({ children }: { children: ReactNode }) {
	const session = await getServerSession();

	if (!session) {
		redirect('/login');
	}

	return children;
}
