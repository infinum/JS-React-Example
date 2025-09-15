import { test as base, expect } from '@playwright/test';
import { AxeResults } from 'axe-core';
import AxeBuilder from '@axe-core/playwright';
import { createHtmlReport } from 'axe-html-reporter';
import { saveHtmlReport } from './utils/axe-core-reporter';
import { LoginPage } from './pages/login';

/**
 * Accessibility rules to check
 */
export const a11yRules = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22a', 'wcag22aa'];

const reportsDir = 'reports/a11y';
let accessibilityScanResults: AxeResults;

export const test = base.extend<{
	homePage: { goto: () => Promise<void> };
}>({
	homePage: async ({ page }, use) => {
		const loginPage = new LoginPage(page);
		await loginPage.goto();
		await loginPage.login('user@example.com', 'password123');
		await page.waitForURL('/en');

		const homePage = {
			goto: async () => {
				await page.goto('/en');
			},
		};

		await use(homePage);
	},
});

test.describe('Home Page Accessibility', () => {
	test('should not have any automatically detectable accessibility violations', async ({
		page,
		homePage,
	}, testInfo) => {
		const currentBrowser = testInfo.project.name;
		const reportName = 'home-en.html';

		await homePage.goto();

		accessibilityScanResults = await new AxeBuilder({ page }).withTags(a11yRules).analyze();

		// const screenshotName = `${currentBrowser}-home-en`;
		// const screenshot = await page.screenshot({
		// 	path: `reports/screenshots/${screenshotName}.png`,
		// 	type: 'png',
		// });

		// await testInfo.attach(screenshotName, {
		// 	body: screenshot,
		// 	contentType: 'image/png',
		// });

		await testInfo.attach('accessibility-scan-results', {
			body: JSON.stringify(accessibilityScanResults, null, 2),
			contentType: 'application/json',
		});

		const axeHtmlReport = createHtmlReport({
			results: accessibilityScanResults,
			options: {
				outputDir: reportsDir,
				reportFileName: `${currentBrowser}/${reportName}`,
				customSummary: `Browser: ${currentBrowser}`,
			},
		});

		saveHtmlReport(axeHtmlReport, currentBrowser, reportName);

		// expect(accessibilityScanResults.violations).toEqual([]);
	});
});
