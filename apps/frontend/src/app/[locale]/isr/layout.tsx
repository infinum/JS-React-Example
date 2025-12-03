import { getServerSession } from '@/lib/auth';
import { getPublicEnv } from '@/lib/env';
import { ReactNode } from 'react';

export default async function IsrLayout({ children }: { children: ReactNode }) {
	const { API_BASE_URL } = getPublicEnv();
	const session = await getServerSession();

	const variableRandomNumber = await fetch(`${API_BASE_URL}/isr`);
	const { randomNumber: varRnd } = await variableRandomNumber.json();

	const fixedRandomNumber = await fetch(`${API_BASE_URL}/isr`, { next: { revalidate: 3600 } });
	const { randomNumber: fixedRnd } = await fixedRandomNumber.json();

	return (
		<div>
			<div className="flex flex-col items-center justify-center border border-amber-800 p-4">
				<h1 className="text-2xl font-bold">ISR</h1>
				<p>Layout random number (should change on refresh): {varRnd}</p>
				<p className="text-red-400">Layout fixed number (should not change on refresh): {fixedRnd}</p>
				<p className="text-blue-400">Session: {session ? 'Logged in' : 'Not logged in'}</p>
			</div>
			<div className="flex flex-col items-center justify-center border border-amber-800 p-4">
				<h1 className="mt-12">Page</h1>
				{children}
			</div>
		</div>
	);
}
