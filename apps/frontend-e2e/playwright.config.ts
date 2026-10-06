import { getE2eApp } from '@infinum/configs/playwright/apps';
import baseConfig from '@infinum/configs/playwright/base';
import { defineConfig, devices } from '@playwright/test';

const app = getE2eApp('frontend');

export default defineConfig({
	...baseConfig,
	testDir: './tests',
	// The seed only sets up the page for the Playwright agents (root playwright.config.ts)
	testIgnore: '**/seed.spec.ts',
	projects: [
		{
			name: 'chromium',
			use: {
				...devices['Desktop Chrome'],
				baseURL: process.env.E2E_BASE_URL ?? `http://localhost:${app.port}`,
			},
		},
	],
	webServer: process.env.CI
		? {
				command: `pnpm --filter ${app.filter} start`,
				port: app.port,
				reuseExistingServer: !process.env.CI,
				env: {
					NODE_OPTIONS: '',
				},
			}
		: undefined,
});
