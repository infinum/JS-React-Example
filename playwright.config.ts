import { e2eApps } from '@infinum/configs/playwright/apps';
import baseConfig from '@infinum/configs/playwright/base';
import { defineConfig, devices } from '@playwright/test';

/**
 * Agent-loop config: every `apps/<name>-e2e` package as one project, used by the `playwright-test`
 * MCP server and the Playwright agents. CI and `pnpm e2e` keep using each package's own config.
 */

// Browser project the committed visual baselines were recorded with in the per-package configs
const baselineProject = 'chromium';

export default defineConfig({
	...baseConfig,
	projects: e2eApps.map((app) => ({
		name: app.name,
		testDir: `${app.dir}/tests`,
		outputDir: `${app.dir}/test-results`,
		// Reuse the package's baselines instead of recording new ones under this project's name
		snapshotPathTemplate: `{testDir}/{testFilePath}-snapshots/{arg}-${baselineProject}{-snapshotSuffix}{ext}`,
		use: {
			...devices['Desktop Chrome'],
			baseURL: `http://localhost:${app.port}`,
		},
	})),
	webServer: e2eApps.map((app) => ({
		command: `pnpm --filter ${app.filter} dev`,
		url: `http://localhost:${app.port}`,
		reuseExistingServer: true,
	})),
});
