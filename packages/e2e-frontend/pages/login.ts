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
		console.log('🔗 Navigating to login page...');
		await this.page.goto('/en/login');
		console.log('🔗 Current URL after goto:', this.page.url());

		// Wait for page to be fully loaded
		await this.page.waitForLoadState('networkidle');
		console.log('✅ Login page loaded successfully');
	}

	async login(email: string, password: string) {
		console.log('📝 Starting login process...');
		console.log('🔗 Current URL before login:', this.page.url());

		// Check if form elements are available
		await this.emailInput.waitFor({ state: 'visible', timeout: 10000 });
		await this.passwordInput.waitFor({ state: 'visible', timeout: 10000 });
		await this.submitButton.waitFor({ state: 'visible', timeout: 10000 });

		console.log('📧 Filling email field...');
		await this.emailInput.fill(email);

		console.log('🔒 Filling password field...');
		await this.passwordInput.fill(password);

		console.log('🔗 URL before submit:', this.page.url());
		console.log('🖱️ Clicking submit button...');
		await this.submitButton.click();

		console.log('🔗 URL immediately after submit:', this.page.url());

		// Wait for navigation to complete
		try {
			await this.page.waitForLoadState('networkidle', { timeout: 15000 });
			console.log('🔗 URL after navigation:', this.page.url());
		} catch (error) {
			console.log('⚠️ Navigation timeout or error:', error instanceof Error ? error.message : String(error));
			console.log('🔗 Final URL:', this.page.url());
		}
	}
}
