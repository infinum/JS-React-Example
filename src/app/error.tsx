'use client';

import Image from 'next/image';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

type ErrorPageProps = Readonly<{
	error: Error & { digest?: string };
	reset: () => void;
}>;

export default function ErrorPage({ error, reset }: ErrorPageProps) {
	useEffect(() => {
		// Report the error to an error reporting service here
		console.error(error);
	}, [error]);

	return (
		<div className="flex flex-col items-center gap-4 p-8">
			<h1 className="text-2xl font-bold">Something went wrong</h1>
			<Image width={100} height={100} alt="" src="/images/infinum-contruction.png" />
			<Button onClick={reset}>Try again</Button>
		</div>
	);
}
