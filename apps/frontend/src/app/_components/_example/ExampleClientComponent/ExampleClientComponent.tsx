'use client';

import { env } from '@/lib/env';

/*
 * Uncommenting the privateVariable should cause an error.
 */
export const ExampleClientComponent = () => {
	const publicVariable = env('NEXT_PUBLIC_EXAMPLE_VARIABLE');
	// const privateVariable = env('PRIVATE_EXAMPLE_VARIABLE');

	return (
		<div className="bg-slate-500 p-4 text-white">
			<p>This is a client component</p>
			<p>Public variable: {publicVariable}</p>
			{/* <p>Private variable: {privateVariable}</p> */}
		</div>
	);
};
