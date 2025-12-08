import { TestInfo } from '@playwright/test';

/**
 * Attach a screenshot to the test report.
 * @param testInfo - TestInfo from Playwright test
 * @param screenshot - Screenshot buffer
 * @param name - Name for the attachment
 */
export async function attachScreenshot(testInfo: TestInfo, screenshot: Buffer, name: string): Promise<void> {
	await testInfo.attach(name, {
		body: screenshot,
		contentType: 'image/png',
	});
}

/**
 * Attach JSON data to the test report.
 * @param testInfo - TestInfo from Playwright test
 * @param data - Data to attach
 * @param name - Name for the attachment
 */
export async function attachJson(testInfo: TestInfo, data: unknown, name: string): Promise<void> {
	await testInfo.attach(name, {
		body: JSON.stringify(data, null, 2),
		contentType: 'application/json',
	});
}
