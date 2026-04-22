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
				// Plain `pnpm start` — `next start` with no mise wrapper. Secrets are
				// expected to be in the job env already (set from GitHub Actions secrets
				// in .github/workflows/e2e.yml). Locally, devs use `pnpm start:mise` to
				// fetch secrets from 1Password via mise.
				command: 'pnpm --filter @infinum/frontend start',
				port: 3000,
				reuseExistingServer: !process.env.CI,
				env: {
					NODE_OPTIONS: '',
				},
			}
		: undefined,
});
