/**
 * Client scenario 4
 *
 * There is an unhandled Promise rejection during React lifecycle.
 * In this case, when the component mounts.
 */

import { useEffect } from 'react';

const Scenario4 = () => {
	// disabled since this is a test scenario
	// eslint-disable-next-line @infinum/no-hooks-in-pages-folder
	useEffect(function () {
		async function doTest() {
			const doAsyncWork = () => Promise.reject(new Error('Client scenario 4'));

			await doAsyncWork();
		}
		// eslint-disable-next-line @typescript-eslint/no-floating-promises
		doTest();
	}, []);

	return <h1>Client scenario 4</h1>;
};

export default Scenario4;
