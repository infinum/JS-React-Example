/**
 * API scenario 2
 *
 * API has a top-of-module exception.
 */

import { start, getServerlessHandler } from '@/lib/bugsnag';
import type { NextApiRequest, NextApiResponse } from 'next';

start();
const serverlessHandler = getServerlessHandler();

function work() {
	throw new Error('API scenario 2');
}

work();

function handler(_req: NextApiRequest, res: NextApiResponse) {
	res.status(200).json({ name: 'John Doe' });
}

export default serverlessHandler(handler);
