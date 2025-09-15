import { test } from '@playwright/test';
import { AxeResults } from 'axe-core';
import AxeBuilder from '@axe-core/playwright';

import { saveHtmlReport } from './utils/axe-core-reporter';
import { createHtmlReport } from 'axe-html-reporter';

/**
 * Array of accessibility rules to check for violations.
 * Add / Remove rules to customize the accessibility scan scope.
 * @see https://playwright.dev/docs/accessibility-testing#scanning-for-wcag-violations
 */
export const a11yRules = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22a', 'wcag22aa'];

export const urlsToCheck = [
	{
		url: '/en',
		name: 'home-en',
	},
];

const reportsDir = 'reports/a11y';
let accessibilityScanResults: AxeResults;

test.describe('Accessibility', () => {
	urlsToCheck.forEach(({ url, name }) => {
		test(`should check: ${url}`, async ({ page }, testInfo) => {
			const currentBrowser = testInfo.project.name;
			const reportName = `${name}.html`;

			await page.goto(url);

			accessibilityScanResults = await new AxeBuilder({ page }).withTags(a11yRules).analyze();

			const screenshotName = `${currentBrowser}-${name}`;
			const screenshot = await page.screenshot({
				path: `reports/screenshots/${screenshotName}.png`,
				type: 'png',
			});

			await testInfo.attach(screenshotName, {
				body: screenshot,
				contentType: 'image/png',
			});

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
		});
	});
});
