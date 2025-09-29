import { Page } from '@playwright/test';

export async function wait(page: Page, timeout = 500) {
	// TODO: useful during demos, but will be removed
	await page.waitForTimeout(timeout);
}
