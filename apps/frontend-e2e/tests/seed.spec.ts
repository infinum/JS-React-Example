import { test } from '@playwright/test';
import { LoginPage } from '../pages/login';

// Seed for the Playwright agents: the planner and generator start every session from the page this leaves open
test('seed', async ({ page }) => {
	const loginPage = new LoginPage(page);
	await loginPage.goto();
	await loginPage.login('user@example.com', 'password123');

	await page.waitForURL('/en');
});
