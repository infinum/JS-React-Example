import Bugsnag from '@bugsnag/js';
import type { NodeConfig } from '@bugsnag/node';
import type { BrowserConfig } from '@bugsnag/browser';
import BugsnagPluginReact from '@bugsnag/plugin-react';
import React, { Fragment } from 'react';
import { PHASE_PRODUCTION_BUILD } from 'next/constants';

export function start() {
	// next.js executes top-level code at build time. See https://github.com/vercel/next.js/discussions/16840 for further example
	// So use NEXT_PHASE to avoid Bugsnag.start being executed during the build phase
	// See https://nextjs.org/docs/api-reference/next.config.js/introduction and https://github.com/vercel/next.js/blob/canary/packages/next/shared/lib/constants.ts#L1-L5 for
	// more details on NEXT_PHASE
	if (process.env.NEXT_PHASE !== PHASE_PRODUCTION_BUILD) {
		if (process.env.NEXT_PUBLIC_BUGSNAG_API_KEY === undefined) {
			throw new Error('NEXT_PUBLIC_BUGSNAG_API_KEY must be set');
		}

		const commonConfig = {
			apiKey: process.env.NEXT_PUBLIC_BUGSNAG_API_KEY,
			appVersion: process.env.NEXT_BUILD_ID,
			releaseStage: process.env.NEXT_PUBLIC_NEXT_APP_ENV,
			enabledReleaseStages: ['production', 'staging', 'uat'],
		};

		const bugsnagPluginReact = new BugsnagPluginReact(React);

		if ((process.env.NEXT_IS_SERVER as unknown as boolean) === true) {
			Bugsnag.start({
				...commonConfig,
				appType: 'server',
				plugins: [
					bugsnagPluginReact,
					// @bugsnag/plugin-aws-lambda must only be imported on the server
					require('@bugsnag/plugin-aws-lambda'),
				],
			} satisfies NodeConfig);
		} else {
			// If preferred two separate Bugsnag projects e.g. a javascript and a node project could be used rather than a single one
			Bugsnag.start({
				...commonConfig,
				appType: 'client',
				plugins: [bugsnagPluginReact],
			} satisfies BrowserConfig);
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
		const reactPlugin = Bugsnag.getPlugin('react');

		if (reactPlugin === undefined) {
			throw new Error('Bugsnag react plugin not found');
		}

		return reactPlugin.createErrorBoundary();
	}
}
