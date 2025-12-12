import { Page } from '@playwright/test';

export interface GotoWithRetryOptions {
	waitUntil?: 'load' | 'domcontentloaded' | 'networkidle';
	timeout?: number;
	maxRetries?: number;
	baseURL?: string;
}

/**
 * Navigate to URL with retry logic and exponential backoff.
 * @param page - Playwright page
 * @param url - URL to navigate to (relative or absolute)
 * @param options - Navigation options
 */
export async function gotoWithRetry(page: Page, url: string, options?: GotoWithRetryOptions): Promise<void> {
	const maxRetries = options?.maxRetries ?? 3;
	const baseURL = options?.baseURL;
	const fullUrl = baseURL && !url.startsWith('http') ? `${baseURL}${url}` : url;
	let lastError: Error | undefined;

	for (let attempt = 1; attempt <= maxRetries; attempt++) {
		try {
			await page.goto(fullUrl, {
				waitUntil: options?.waitUntil ?? 'networkidle',
				timeout: options?.timeout ?? 30000,
			});
			return;
		} catch (error) {
			lastError = error instanceof Error ? error : new Error(String(error));
			if (attempt < maxRetries) {
				// Exponential backoff: 1s, 2s, 4s, etc.
				const delay = Math.min(1000 * Math.pow(2, attempt - 1), 10000);
				await new Promise((resolve) => setTimeout(resolve, delay));
			}
		}
	}

	throw lastError ?? new Error(`Navigation to ${fullUrl} failed after ${maxRetries} retries`);
}
