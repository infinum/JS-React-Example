import { Page, Locator } from '@playwright/test';
import { getBaseUrl } from '../utils/config';

/**
 * Options for BasePage constructor.
 */
export interface BasePageOptions {
	/**
	 * Base URL for the application. If not provided, will use E2E_BASE_URL env var or default.
	 */
	baseURL?: string;
}

/**
 * Abstract base class for Page Object Models.
 * Provides common functionality for all page objects.
 */
export abstract class BasePage {
	readonly page: Page;
	protected readonly baseURL: string;

	constructor(page: Page, options?: BasePageOptions) {
		this.page = page;
		this.baseURL = options?.baseURL ?? getBaseUrl();
	}

	/**
	 * Navigate to the page URL.
	 * Override this method in subclasses to set the specific URL.
	 */
	abstract goto(): Promise<void>;

	/**
	 * Navigate to a URL (relative or absolute).
	 * Relative URLs will be resolved against the base URL.
	 * @param url - URL to navigate to
	 * @param options - Navigation options
	 */
	protected async navigateTo(
		url: string,
		options?: { waitUntil?: 'load' | 'domcontentloaded' | 'networkidle'; timeout?: number }
	): Promise<void> {
		const fullUrl = url.startsWith('http') ? url : `${this.baseURL}${url.startsWith('/') ? url : `/${url}`}`;
		await this.page.goto(fullUrl, {
			waitUntil: options?.waitUntil ?? 'networkidle',
			timeout: options?.timeout ?? 30000,
		});
	}

	/**
	 * Wait for the page to be fully loaded.
	 * @param options - Wait options
	 */
	protected async waitForLoad(options?: { timeout?: number }): Promise<void> {
		await this.page.waitForLoadState('networkidle', { timeout: options?.timeout ?? 15000 });
	}

	/**
	 * Wait for a specific element to be visible.
	 * @param locator - Element locator
	 * @param options - Wait options
	 */
	protected async waitForVisible(locator: Locator, options?: { timeout?: number }): Promise<void> {
		await locator.waitFor({ state: 'visible', timeout: options?.timeout ?? 10000 });
	}

	/**
	 * Wait for navigation to complete.
	 * Alias for waitForLoad for semantic clarity.
	 * @param options - Wait options
	 */
	protected async waitForNavigation(options?: { timeout?: number }): Promise<void> {
		await this.waitForLoad(options);
	}
}
