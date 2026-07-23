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
				// The frontend's `start` script wraps `next start` with
				// scripts/with-secrets.sh. In CI the wrapper auto-detects no provider
				// CLI is present and falls through to plain exec — secrets are already
				// in the job env (set from GitHub Actions secrets in
				// .github/workflows/e2e.yml).
				command: 'pnpm --filter @infinum/frontend start',
				port: 3000,
				reuseExistingServer: !process.env.CI,
				env: {
					NODE_OPTIONS: '',
				},
			}
		: undefined,
});
