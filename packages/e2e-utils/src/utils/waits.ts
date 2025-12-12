import { Page } from '@playwright/test';

/**
 * Wait for URL to match pattern.
 * @param page - Playwright page
 * @param url - URL pattern or string
 * @param timeout - Timeout in milliseconds (default: 10000)
 */
export async function waitForUrl(page: Page, url: string | RegExp, timeout = 10000): Promise<void> {
	await page.waitForURL(url, { timeout });
}
