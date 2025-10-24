import { defineConfig, devices, PlaywrightTestConfig } from '@playwright/test';
import { join } from 'path';

const baseConfig: PlaywrightTestConfig = {
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
	/* Projects for different packages / browsers */
	projects: [
		{
			name: 'e2e-frontend',
			testDir: join(__dirname, '../../packages/e2e-frontend'),
			use: {
				...devices['Desktop Chrome'],
				baseURL: 'http://localhost:3000',
			},
		},
		{
			name: 'e2e-other',
			testDir: join(__dirname, '../../packages/e2e-other'),
			use: {
				...devices['Desktop Chrome'],
				baseURL: 'http://localhost:3001',
			},
		},
	],
};

export default defineConfig(baseConfig);
