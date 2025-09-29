import { test as base, expect } from '@playwright/test';
import { LoginPage } from './pages/login';

export const test = base.extend<{
	homePage: { goto: () => Promise<void> };
}>({
	homePage: async ({ page }, use) => {
		const loginPage = new LoginPage(page);
		await loginPage.goto();
		await loginPage.login('user@example.com', 'password123');
		await page.waitForURL('/en');

		const homePage = {
			goto: async () => {
				await page.goto('/en');
			},
		};

		await use(homePage);
	},
});

test.describe('Home Page', () => {
	test('should match home-page-content screenshot', async ({ page, browserName, homePage }) => {
		await homePage.goto();

		// run `playwright test --update-snapshots` to update the screenshot
		const screenshotPath = `reports/screenshots/${browserName}-home-en.png`;

		const homePageContent = page.getByTestId('home-page-content');
		await expect(homePageContent).toBeVisible();

		// do a visual regression check with snapshot
		await expect(homePageContent).toHaveScreenshot(screenshotPath);
	});
});
