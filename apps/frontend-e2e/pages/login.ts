import { Page, Locator } from '@playwright/test';
import { BasePage } from '@infinum/e2e-utils/pages';

export class LoginPage extends BasePage {
	readonly emailInput: Locator;
	readonly passwordInput: Locator;
	readonly submitButton: Locator;
	readonly errorMessage: Locator;

	constructor(page: Page) {
		super(page);

		// Semantic locators
		this.emailInput = page.getByLabel('Email');
		this.passwordInput = page.getByLabel('Password');
		this.submitButton = page.getByRole('button', { name: 'Sign in' });
		this.errorMessage = page.getByTestId('login-error');
	}

	async goto() {
		await this.navigateTo('/en/login');
		await this.waitForLoad();
	}

	async login(email: string, password: string) {
		// Check if form elements are available
		await this.waitForVisible(this.emailInput);
		await this.waitForVisible(this.passwordInput);
		await this.waitForVisible(this.submitButton);

		await this.emailInput.fill(email);
		await this.passwordInput.fill(password);
		await this.submitButton.click();

		// Wait for navigation to complete
		await this.waitForNavigation();
	}
}
