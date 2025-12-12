/**
 * Get base URL from environment or default.
 * @param defaultUrl - Default URL (default: 'http://localhost:3000')
 */
export function getBaseUrl(defaultUrl = 'http://localhost:3000'): string {
	return process.env.E2E_BASE_URL ?? defaultUrl;
}
