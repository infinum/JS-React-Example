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
	}

	async login(email: string, password: string) {
		await this.emailInput.fill(email);
		await this.passwordInput.fill(password);
		await this.submitButton.click();
	}
}
