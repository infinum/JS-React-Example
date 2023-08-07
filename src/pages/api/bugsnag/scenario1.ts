/**
 * API scenario 1
 *
 * API has a top-of-module Promise that rejects, but its result is not awaited.
 */

import { start, getServerlessHandler } from '@/lib/bugsnag';
import type { NextApiRequest, NextApiResponse } from 'next';

start();
const serverlessHandler = getServerlessHandler();

const doAsyncWork = () => Promise.reject(new Error('API scenario 1'));

// eslint-disable-next-line @typescript-eslint/no-floating-promises
doAsyncWork();

function handler(_req: NextApiRequest, res: NextApiResponse) {
	res.status(200).json({ name: 'John Doe' });
}

export default serverlessHandler(handler);
