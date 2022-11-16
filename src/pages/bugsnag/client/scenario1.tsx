import { PHASE_PRODUCTION_BUILD } from 'next/constants';

/**
 * Client scenario 1
 *
 * There is a top-of-module Promise that rejects, but its result is not awaited.
 */

// next.js executes top-level code at build time. See https://github.com/vercel/next.js/discussions/16840 for further example
// So use NEXT_PHASE to avoid this failing at build time
if (process.env.NEXT_PHASE !== PHASE_PRODUCTION_BUILD) {
	const doAsyncWork = () => Promise.reject(new Error('Client scenario 1'));
	doAsyncWork();
}

const Scenario1 = () => <h1>Client scenario 1</h1>;

export default Scenario1;
