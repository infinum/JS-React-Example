/* eslint-disable react-hooks/purity */
import { getPublicEnv } from '@/lib/env';
import { unstable_cache } from 'next/cache';
import { FC } from 'react';

// eslint-disable-next-line require-await
const getCachedRandom = unstable_cache(async () => Math.random(), ['isr-hardcoded-random'], { revalidate: 3600 });

const TestIsrPage: FC = async () => {
	const { API_BASE_URL } = getPublicEnv();

	const [hardcodedRandom, response] = await Promise.all([
		getCachedRandom(),
		fetch(`${API_BASE_URL}/isr`, {
			next: { revalidate: 3600 },
		}),
	]);

	const { randomNumber } = await response.json();

	return (
		<>
			<p>Random number (should change on refresh): {Math.random()}</p>
			<p className="text-red-400">Cached random number (should not change on refresh): {hardcodedRandom}</p>
			<p className="text-red-400">API random number (should not change on refresh): {randomNumber}</p>
		</>
	);
};

export const revalidate = 3600;

export default TestIsrPage;
