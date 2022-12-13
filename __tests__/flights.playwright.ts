import { test, expect } from '@playwright/test';

test.describe('Flights', () => {
	test(`should match snapshot`, async ({ page }) => {
		await page.goto(`http://localhost:3000/flights`, { waitUntil: 'networkidle' });

		expect(await page.screenshot({ fullPage: true })).toMatchSnapshot(`flights.png`, { threshold: 50 });
	});
});
