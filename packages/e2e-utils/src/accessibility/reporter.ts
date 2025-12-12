import fs from 'fs';
import path from 'path';

/**
 * Save HTML report to specified directory.
 * @param axeReportContent - HTML content created by axe-html-reporter
 * @param currentBrowser - name of the current browser
 * @param reportName - name of the report file
 * @param reportsDir - base directory for reports (default: 'reports/a11y')
 */
export function saveHtmlReport(
	axeReportContent: string,
	currentBrowser: string,
	reportName: string,
	reportsDir = 'reports/a11y'
): void {
	const reportPath = path.join(reportsDir, currentBrowser, reportName);
	const reportDir = path.dirname(reportPath);

	if (!fs.existsSync(reportDir)) {
		fs.mkdirSync(reportDir, { recursive: true });
	}

	fs.writeFileSync(reportPath, axeReportContent);
	console.info(`HTML report created: ${reportPath}`);
}
