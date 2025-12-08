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
		trace: 'on-first-retry',
		viewport: { width: 1280, height: 720 },
	},
};

module.exports = defineConfig(baseConfig);
