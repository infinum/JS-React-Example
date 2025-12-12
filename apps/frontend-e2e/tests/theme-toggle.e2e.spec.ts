import { test as base, expect, Page } from '@playwright/test';
import { LoginPage } from '../pages/login';

export const test = base.extend<{ authedPage: Page }>({
	authedPage: async ({ page }, use) => {
		// Start in a deterministic theme to avoid flakiness across headless/headed.
		await page.addInitScript(() => {
			if (!localStorage.getItem('theme')) {
				localStorage.setItem('theme', 'light');
			}
		});

		const loginPage = new LoginPage(page);
		await loginPage.goto();
		await loginPage.login('user@example.com', 'password123');
		await page.waitForURL('/en');

		await use(page);
	},
});

test.describe('Theme Toggle', () => {
	test('cycles through light → dark → rainbow → light', async ({ authedPage }) => {
		const toggle = authedPage.getByTestId('theme-toggle');
		const html = authedPage.locator('html');

		await expect(toggle).toBeVisible();
		await expect(html).toHaveAttribute('class', /light/);
		await expect(toggle).toHaveText('🌞');

		await toggle.click();
		await expect(html).toHaveAttribute('class', /dark/);
		await expect(toggle).toHaveText('🌙');
		expect(await authedPage.evaluate(() => localStorage.getItem('theme'))).toBe('dark');

		await toggle.click();
		await expect(html).toHaveAttribute('class', /rainbow/);
		await expect(toggle).toHaveText('🌈');
		expect(await authedPage.evaluate(() => localStorage.getItem('theme'))).toBe('rainbow');

		await toggle.click();
		await expect(html).toHaveAttribute('class', /light/);
		await expect(toggle).toHaveText('🌞');
		expect(await authedPage.evaluate(() => localStorage.getItem('theme'))).toBe('light');
	});

	test('persists selected theme after reload', async ({ authedPage }) => {
		const toggle = authedPage.getByTestId('theme-toggle');
		const html = authedPage.locator('html');

		await toggle.click(); // light -> dark
		await expect(html).toHaveAttribute('class', /dark/);

		await authedPage.reload();

		await expect(html).toHaveAttribute('class', /dark/);
		await expect(toggle).toHaveText('🌙');
		expect(await authedPage.evaluate(() => localStorage.getItem('theme'))).toBe('dark');
	});

	test('captures screenshots for each theme state', async ({ authedPage }) => {
		const toggle = authedPage.getByTestId('theme-toggle');

		await expect(toggle).toHaveScreenshot('theme-toggle-light.png');

		await toggle.click(); // light -> dark
		await expect(toggle).toHaveScreenshot('theme-toggle-dark.png');

		await toggle.click(); // dark -> rainbow
		await expect(toggle).toHaveScreenshot('theme-toggle-rainbow.png');
	});
});
