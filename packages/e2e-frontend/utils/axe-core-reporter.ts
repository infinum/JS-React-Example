import fs from 'fs';
import path from 'path';

const reportsDir = 'reports/a11y'; // TODO Move to config

/**
 * Save HTML report to specified directory.
 * @param {string} axeReportContent - HTML content created by axe-html-reporter
 * @param {string} currentBrowser - name of the current browser
 * @param {string} reportName - name of the report file
 */
export function saveHtmlReport(axeReportContent: string, currentBrowser: string, reportName: string): void {
	const reportPath = path.join(reportsDir, currentBrowser, reportName);
	const reportDir = path.dirname(`${reportPath}${currentBrowser}`);

	if (!fs.existsSync(reportPath)) {
		fs.mkdirSync(reportDir, { recursive: true });
	}

	fs.writeFileSync(reportPath, axeReportContent);
	console.log(`HTML report created: ${reportPath}`);
}
