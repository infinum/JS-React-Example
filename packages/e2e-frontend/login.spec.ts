import { test as base, expect } from '@playwright/test';

import { LoginPage } from './pages/login';

export const test = base.extend<{
	loginPage: LoginPage;
}>({
	loginPage: async ({ page }, use) => {
		const loginPage = new LoginPage(page);
		await use(loginPage); // pass fixture to tests
	},
});

test.describe('LoginForm tests', () => {
	test('shows error with wrong password', async ({ page, loginPage }) => {
		await loginPage.goto();
		await loginPage.login('user@example.com', 'invalid');

		const error = page.getByText('Invalid password');
		await expect(error).toBeVisible();

		// Optionally, assert the text explicitly
		await expect(error).toHaveText('Invalid password');
	});

	test('successfully logs in with correct password', async ({ loginPage, page }) => {
		await loginPage.goto();
		await loginPage.login('user@example.com', 'valid');

		await page.waitForURL('/en', { timeout: 2000 });
	});
});
