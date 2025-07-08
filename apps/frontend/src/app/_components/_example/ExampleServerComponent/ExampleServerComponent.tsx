import { env } from '@/lib/env';

export const ExampleServerComponent = () => {
	const publicVariable = env('NEXT_PUBLIC_EXAMPLE_VARIABLE');
	const privateVariable = env('PRIVATE_EXAMPLE_VARIABLE');

	return (
		<div className="bg-slate-500 p-4 text-white">
			<p>This is a server component</p>
			<p>Public variable: {publicVariable}</p>
			<p>Private variable: {privateVariable}</p>
		</div>
	);
};
