/**
 * API scenario 3
 *
 * API has has an exception in its request handler.
 */

import { start, getServerlessHandler } from '@/lib/bugsnag';

start();
const serverlessHandler = getServerlessHandler();

function work() {
	throw new Error('API scenario 3');
}

async function handler(req, res) {
	work();

	res.status(200).json({ name: 'John Doe' });
}

export default serverlessHandler(handler);
