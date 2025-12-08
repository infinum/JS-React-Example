import { Browser, expect, test } from '@playwright/test';
import { LoginPage } from '../pages/login';
import { viewports, gotoWithRetry, waitForUrl, getScreenshotPath } from '@infinum/e2e-utils';

async function createContext(
	browser: Browser,
	email: string,
	password: string,
	viewport: { width: number; height: number }
) {
	const context = await browser.newContext({ viewport });
	const page = await context.newPage();

	// Test basic connectivity
	try {
		await gotoWithRetry(page, '/');
		await page.title();
	} catch (error) {
		throw error;
	}

	const login = new LoginPage(page);
	await login.goto();
	await login.login(email, password);

	try {
		await waitForUrl(page, '/en', 30000);
	} catch (error) {
		// Take screenshot for debugging
		await page.screenshot({ path: `debug-${email}-failed.png` });
		throw error;
	}

	await expect(page.locator('text=Logged in')).toBeVisible();
	return { context, page };
}

test.describe('Browser contexts & multiple devices', () => {
	test('should allow multiple users in separate contexts with different viewports and positions', async ({
		browser,
	}) => {
		// Desktop user
		const desktop = await createContext(browser, 'user1@example.com', 'password123', viewports.desktop);

		// Tablet user (e.g., iPad)
		const tablet = await createContext(browser, 'user3@example.com', 'password123', viewports.tablet);

		// Mobile user
		const mobile = await createContext(browser, 'user2@example.com', 'password123', viewports.mobile);

		// Screenshots for visual verification + assertions
		const desktopShot = await desktop.page.screenshot({ path: getScreenshotPath('desktop', 'logged-in') });
		const tabletShot = await tablet.page.screenshot({ path: getScreenshotPath('tablet', 'logged-in') });
		const mobileShot = await mobile.page.screenshot({ path: getScreenshotPath('mobile', 'logged-in') });

		await expect(desktop.page.locator('text=Logged in')).toBeVisible();
		await expect(tablet.page.locator('text=Logged in')).toBeVisible();
		await expect(mobile.page.locator('text=Logged in')).toBeVisible();

		// Attach for debugging/reporting
		await test.info().attach('desktop-logged-in', { body: desktopShot, contentType: 'image/png' });
		await test.info().attach('tablet-logged-in', { body: tabletShot, contentType: 'image/png' });
		await test.info().attach('mobile-logged-in', { body: mobileShot, contentType: 'image/png' });

		await desktop.context.close();
		await tablet.context.close();
		await mobile.context.close();
	});
});
