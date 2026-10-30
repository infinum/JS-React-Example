const { defineConfig } = require('@playwright/test');

/** @type {import('@playwright/test').PlaywrightTestConfig} */
const baseConfig = {
	/* Shared settings for all projects */
	fullyParallel: true,
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 2 : 0,
	workers: process.env.CI ? 1 : undefined,
	reporter: process.env.CI ? [['github'], ['line']] : 'list',
	use: {
		// Locally there are no retries, so keep traces of failures for debugging (and for the agent loop)
		trace: process.env.CI ? 'on-first-retry' : 'retain-on-failure',
		viewport: { width: 1280, height: 720 },
	},
};

module.exports = defineConfig(baseConfig);
