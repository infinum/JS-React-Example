/**
 * Client scenario 6
 *
 * There is an exception during React lifecycle that is caught by the closest parent Error Boundary.
 */

import { useEffect } from 'react';

import { ErrorFallback } from '@/components/shared/fallbacks/ErrorFallback/ErrorFallback';
import { ErrorBoundary } from '@/components/shared/utilities/ErrorBoundary/ErrorBoundary';

let showError = true;

const Scenario6Child = () => {
	useEffect(() => {
		if (showError) {
			showError = false;
			throw new Error('Client scenario 6');
		}
	}, []);

	return <h1>Client scenario 6</h1>;
};

const Scenario6 = () => (
	<ErrorBoundary FallbackComponent={ErrorFallback}>
		<Scenario6Child />
	</ErrorBoundary>
);

export default Scenario6;
