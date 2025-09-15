import { Page, Locator } from '@playwright/test';

export class LoginPage {
	readonly page: Page;
	readonly emailInput: Locator;
	readonly passwordInput: Locator;
	readonly submitButton: Locator;
	readonly errorMessage: Locator;

	constructor(page: Page) {
		this.page = page;

		// Semantic locators
		this.emailInput = page.getByLabel('Email');
		this.passwordInput = page.getByLabel('Password');
		this.submitButton = page.getByRole('button', { name: 'Sign in' });
		this.errorMessage = page.getByTestId('login-error');
	}

	async goto() {
		await this.page.goto('/en/login');

		// Wait for page to be fully loaded
		await this.page.waitForLoadState('networkidle');
	}

	async login(email: string, password: string) {
		// Check if form elements are available
		await this.emailInput.waitFor({ state: 'visible', timeout: 10000 });
		await this.passwordInput.waitFor({ state: 'visible', timeout: 10000 });
		await this.submitButton.waitFor({ state: 'visible', timeout: 10000 });

		await this.emailInput.fill(email);

		await this.passwordInput.fill(password);

		await this.submitButton.click();

		// Wait for navigation to complete
		try {
			await this.page.waitForLoadState('networkidle', { timeout: 15000 });
		} catch (error) {}
	}
}
