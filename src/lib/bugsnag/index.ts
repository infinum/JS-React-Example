import Bugsnag from '@bugsnag/js';
import BugsnagPluginReact from '@bugsnag/plugin-react';
import React, { Fragment } from 'react';
import { PHASE_PRODUCTION_BUILD } from 'next/constants';

export function start() {
	// next.js executes top-level code at build time. See https://github.com/vercel/next.js/discussions/16840 for further example
	// So use NEXT_PHASE to avoid Bugsnag.start being executed during the build phase
	// See https://nextjs.org/docs/api-reference/next.config.js/introduction and https://github.com/vercel/next.js/blob/canary/packages/next/shared/lib/constants.ts#L1-L5 for
	// more details on NEXT_PHASE
	if (process.env.NEXT_PHASE !== PHASE_PRODUCTION_BUILD) {
		const commonConfig = {
			apiKey: process.env.NEXT_PUBLIC_BUGSNAG_API_KEY,
			appVersion: process.env.NEXT_BUILD_ID,
			releaseStage: process.env.NEXT_PUBLIC_NEXT_APP_ENV,
			enabledReleaseStages: ['production', 'staging', 'uat'],
		};

		if ((process.env.NEXT_IS_SERVER as unknown as boolean) === true) {
			Bugsnag.start({
				...commonConfig,
				appType: 'server',
				plugins: [
					new BugsnagPluginReact(React),
					// @bugsnag/plugin-aws-lambda must only be imported on the server
					require('@bugsnag/plugin-aws-lambda'),
				],
			});
		} else {
			// If preferred two separate Bugsnag projects e.g. a javascript and a node project could be used rather than a single one
			Bugsnag.start({
				...commonConfig,
				appType: 'client',
				plugins: [new BugsnagPluginReact(React)],
			});
		}
	}
}

export function getServerlessHandler() {
	return Bugsnag.getPlugin('awsLambda').createHandler();
}

export function getErrorBoundary() {
	if (process.env.NEXT_PHASE === PHASE_PRODUCTION_BUILD) {
		return Fragment;
	} else {
		return Bugsnag.getPlugin('react').createErrorBoundary();
	}
}
