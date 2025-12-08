import baseConfig from '@infinum/configs/playwright/base';
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
	...baseConfig,
	testDir: './tests',
	projects: [
		{
			name: 'chromium',
			use: {
				...devices['Desktop Chrome'],
				baseURL: process.env.E2E_BASE_URL ?? 'http://localhost:3000',
			},
		},
	],
	webServer: process.env.CI
		? {
				command: 'pnpm --filter @infinum/frontend dev',
				port: 3000,
				reuseExistingServer: !process.env.CI,
			}
		: undefined,
});
