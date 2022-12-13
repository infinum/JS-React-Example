import { test, expect } from '@playwright/test';

test.describe('Home', () => {
	test(`should match snapshot`, async ({ page }) => {
		await page.goto(`http://localhost:3000`, { waitUntil: 'networkidle' });

		expect(await page.screenshot({ fullPage: true })).toMatchSnapshot(`home.png`, { threshold: 50 });
	});
});
