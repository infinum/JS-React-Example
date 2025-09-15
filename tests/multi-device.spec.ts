import { test, expect, Browser } from '@playwright/test';
import { LoginPage } from './pages/login';
import { wait } from './utils';

async function createContext(
	browser: Browser,
	email: string,
	password: string,
	viewport: { width: number; height: number }
) {
	const context = await browser.newContext({ viewport });
	const page = await context.newPage();

	const login = new LoginPage(page);
	await login.goto();
	await login.login(email, password);

	await page.waitForURL('/en');
	await expect(page.locator('text=Logged in')).toBeVisible();
	return { context, page };
}

test.describe('Browser contexts & multiple devices', () => {
	test('should allow multiple users in separate contexts with different viewports and positions', async ({
		browser,
	}) => {
		// Desktop user
		const desktop = await createContext(browser, 'user1@example.com', 'password123', { width: 1280, height: 720 });
		await wait(desktop.page);

		// Tablet user (e.g., iPad)
		const tablet = await createContext(browser, 'user3@example.com', 'password123', { width: 768, height: 1024 });
		await wait(tablet.page);

		// Mobile user
		const mobile = await createContext(browser, 'user2@example.com', 'password123', { width: 375, height: 812 });
		await wait(mobile.page);

		// Screenshots for visual verification
		await desktop.page.screenshot({ path: 'reports/screenshots/desktop-logged-in.png' });
		await tablet.page.screenshot({ path: 'reports/screenshots/tablet-logged-in.png' });
		await mobile.page.screenshot({ path: 'reports/screenshots/mobile-logged-in.png' });

		// Close contexts
		await wait(desktop.page, 250);
		await desktop.context.close();
		await wait(tablet.page, 250);
		await tablet.context.close();
		await wait(mobile.page, 250);
		await mobile.context.close();
	});
});
