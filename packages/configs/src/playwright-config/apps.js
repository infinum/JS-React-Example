/**
 * E2E apps in the monorepo — one entry per `apps/<name>-e2e` package.
 *
 * Shared by each package's own `playwright.config.ts` (CI, `pnpm e2e`) and the root
 * `playwright.config.ts` (Playwright agents / `playwright-test` MCP server), so both stay in sync.
 *
 * @type {ReadonlyArray<import('./apps').E2eApp>}
 */
const e2eApps = [
	{
		name: 'frontend',
		dir: 'apps/frontend-e2e',
		filter: '@infinum/frontend',
		port: 3000,
	},
];

/** @param {string} name */
function getE2eApp(name) {
	const app = e2eApps.find((e2eApp) => e2eApp.name === name);

	if (!app) {
		throw new Error(`Unknown E2E app "${name}". Add it to @infinum/configs/playwright/apps.`);
	}

	return app;
}

module.exports = { e2eApps, getE2eApp };
