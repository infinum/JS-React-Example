import path from 'path';

/**
 * Get screenshot path with consistent naming.
 * @param browserName - Name of the browser
 * @param testName - Name of the test
 * @param extension - File extension (default: 'png')
 * @param baseDir - Base directory (default: 'reports/screenshots')
 */
export function getScreenshotPath(
	browserName: string,
	testName: string,
	extension = 'png',
	baseDir = 'reports/screenshots'
): string {
	return path.join(baseDir, `${browserName}-${testName}.${extension}`);
}
