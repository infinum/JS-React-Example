import { Browser, expect, test } from '@playwright/test';
import { LoginPage } from './pages/login';

async function createContext(
	browser: Browser,
	email: string,
	password: string,
	viewport: { width: number; height: number }
) {
	console.log(`🖥️ Creating context for ${email} with viewport ${viewport.width}x${viewport.height}`);

	const context = await browser.newContext({ viewport });
	const page = await context.newPage();

	// Test basic connectivity
	console.log('🌐 Testing basic connectivity...');
	try {
		await page.goto('/', { waitUntil: 'networkidle', timeout: 30000 });
		console.log('🔗 Root page URL:', page.url());

		// Check if page loaded successfully
		const title = await page.title();
		console.log('📄 Page title:', title);
	} catch (error) {
		console.log('❌ Failed to load root page:', error instanceof Error ? error.message : String(error));
	}

	const login = new LoginPage(page);
	await login.goto();
	console.log('🔗 URL after login.goto():', page.url());

	await login.login(email, password);
	console.log('🔗 URL after login.login():', page.url());

	console.log('⏳ Waiting for URL to change to /en...');
	try {
		await page.waitForURL('/en', { timeout: 30000 });
		console.log("✅ URL after waitForURL('/en'):", page.url());
	} catch (error) {
		console.log('❌ waitForURL failed:', error instanceof Error ? error.message : String(error));
		console.log('🔗 Current URL:', page.url());

		// Take screenshot for debugging
		await page.screenshot({ path: `debug-${email}-failed.png` });
		throw error;
	}

	await expect(page.locator('text=Logged in')).toBeVisible();
	return { context, page };
}

test.describe('Browser contexts & multiple devices', () => {
	test('should allow multiple users in separate contexts with different viewports and positions', async ({
		browser,
	}) => {
		// Desktop user
		const desktop = await createContext(browser, 'user1@example.com', 'password123', { width: 1280, height: 720 });

		// Tablet user (e.g., iPad)
		const tablet = await createContext(browser, 'user3@example.com', 'password123', { width: 768, height: 1024 });

		// Mobile user
		const mobile = await createContext(browser, 'user2@example.com', 'password123', { width: 375, height: 812 });

		// Screenshots for visual verification
		await desktop.page.screenshot({ path: 'reports/screenshots/desktop-logged-in.png' });
		await tablet.page.screenshot({ path: 'reports/screenshots/tablet-logged-in.png' });
		await mobile.page.screenshot({ path: 'reports/screenshots/mobile-logged-in.png' });

		await desktop.context.close();
		await tablet.context.close();
		await mobile.context.close();
	});
});
