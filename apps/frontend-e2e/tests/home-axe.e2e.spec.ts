import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { createHtmlReport } from 'axe-html-reporter';
import { a11yRules, saveHtmlReport, attachScreenshot, attachJson, getScreenshotPath } from '@infinum/e2e-utils';

export const urlsToCheck = [
	{
		url: '/en',
		name: 'home-en',
	},
];

const reportsDir = 'reports/a11y';

test.describe('Accessibility', () => {
	urlsToCheck.forEach(({ url, name }) => {
		test(`should check: ${url}`, async ({ page }, testInfo) => {
			const currentBrowser = testInfo.project.name;
			const reportName = `${name}.html`;

			await page.goto(url);

			const accessibilityScanResults = await new AxeBuilder({ page }).withTags(a11yRules).analyze();
			expect(accessibilityScanResults.violations, 'Expected zero a11y violations').toHaveLength(0);

			const screenshotName = `${currentBrowser}-${name}`;
			const screenshot = await page.screenshot({
				path: getScreenshotPath(currentBrowser, name),
				type: 'png',
			});

			await attachScreenshot(testInfo, screenshot, screenshotName);
			await attachJson(testInfo, accessibilityScanResults, 'accessibility-scan-results');

			const axeHtmlReport = createHtmlReport({
				results: accessibilityScanResults,
				options: {
					customSummary: `Browser: ${currentBrowser}`,
				},
			});

			saveHtmlReport(axeHtmlReport, currentBrowser, reportName, reportsDir);
		});
	});
});
