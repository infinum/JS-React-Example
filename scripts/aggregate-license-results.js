/**
 * This script aggregates license check results from all workspace packages
 * and creates a unified GitHub Actions Job Summary.
 *
 * It reads temporary result files created by check-licenses-workspace.js
 * and generates a comprehensive summary table.
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

// Import @actions/core only if in GitHub Actions environment
let core;
try {
	if (process.env.GITHUB_ACTIONS) {
		core = require('@actions/core');
	}
} catch {
	// Ignore if not available
}

const tempDir = path.join(os.tmpdir(), 'license-check-results');

function readAllResults() {
	if (!fs.existsSync(tempDir)) {
		console.warn('No license check results found');
		return [];
	}

	const files = fs.readdirSync(tempDir).filter((file) => file.endsWith('.json'));
	const results = [];

	for (const file of files) {
		try {
			const content = fs.readFileSync(path.join(tempDir, file), 'utf8');
			const result = JSON.parse(content);
			results.push(result);
		} catch (error) {
			console.warn(`Failed to read result file ${file}:`, error.message);
		}
	}

	return results.sort((a, b) => a.packageName.localeCompare(b.packageName));
}

function generateSummary(results, isGitHubActions = false) {
	const totalPackages = results.length;
	const successfulPackages = results.filter((r) => r.success).length;
	const failedPackages = totalPackages - successfulPackages;

	let summary = `# 📋 License Check Results\n\n`;

	if (failedPackages > 0) {
		summary += `🚨 **Status: FAILED** - ${failedPackages} of ${totalPackages} packages failed license check\n\n`;
	} else {
		summary += `✅ **Status: PASSED** - All ${totalPackages} packages passed license check\n\n`;
	}

	summary += `## Summary\n\n`;
	summary += `| Status | Count |\n`;
	summary += `|--------|-------|\n`;
	summary += `| ✅ Passed | ${successfulPackages} |\n`;
	summary += `| ❌ Failed | ${failedPackages} |\n`;
	summary += `| 📦 Total | ${totalPackages} |\n\n`;

	summary += `## Package Details\n\n`;
	summary += `| Package | Status | Dependencies | Error |\n`;
	summary += `|---------|--------|--------------|-------|\n`;

	for (const result of results) {
		const status = result.success ? '✅' : '❌';
		const packageName = result.packageName;
		const depCount = result.result && typeof result.result === 'object' ? Object.keys(result.result).length : 'N/A';
		const error = result.error ? result.error.substring(0, 100) + '...' : '-';

		summary += `| \`${packageName}\` | ${status} | ${depCount} | ${error} |\n`;
	}

	// Add license distribution for successful packages
	const licenseCounts = {};
	results
		.filter((r) => r.success && r.result)
		.forEach((result) => {
			if (typeof result.result === 'object') {
				Object.values(result.result).forEach((pkg) => {
					if (pkg.licenses) {
						const license = Array.isArray(pkg.licenses) ? pkg.licenses.join(', ') : pkg.licenses;
						licenseCounts[license] = (licenseCounts[license] || 0) + 1;
					}
				});
			}
		});

	if (Object.keys(licenseCounts).length > 0) {
		summary += `\n## License Distribution\n\n`;
		summary += `| License | Count |\n`;
		summary += `|---------|-------|\n`;

		const sortedLicenses = Object.entries(licenseCounts).sort(([, a], [, b]) => b - a);

		for (const [license, count] of sortedLicenses) {
			summary += `| ${license} | ${count} |\n`;
		}
	}

	// Add detailed dependency lists (only in GitHub Actions)
	if (isGitHubActions) {
		summary += `\n## Detailed Dependencies\n\n`;

		for (const result of results.filter((r) => r.success && r.result)) {
			if (typeof result.result === 'object') {
				const dependencies = Object.entries(result.result);

				summary += `<details>\n`;
				summary += `<summary><strong>${result.packageName}</strong> (${dependencies.length} dependencies)</summary>\n\n`;
				summary += `| Package | Version | License | Repository |\n`;
				summary += `|---------|---------|---------|------------|\n`;

				dependencies
					.sort(([a], [b]) => a.localeCompare(b))
					.forEach(([nameWithVersion, info]) => {
						// Extract package name and version from "package@version" format
						const lastAtIndex = nameWithVersion.lastIndexOf('@');
						const packageName = lastAtIndex > 0 ? nameWithVersion.substring(0, lastAtIndex) : nameWithVersion;
						const version = lastAtIndex > 0 ? nameWithVersion.substring(lastAtIndex + 1) : 'Unknown';

						const license = Array.isArray(info.licenses) ? info.licenses.join(', ') : info.licenses || 'Unknown';
						const repo = info.repository || '-';

						summary += `| \`${packageName}\` | ${version} | ${license} | ${repo} |\n`;
					});

				summary += `\n</details>\n\n`;
			}
		}
	}

	summary += `\n---\n`;
	summary += `Generated at: ${new Date().toISOString()}\n`;

	return summary;
}

function cleanup() {
	try {
		if (fs.existsSync(tempDir)) {
			fs.rmSync(tempDir, { recursive: true, force: true });
		}
	} catch (error) {
		console.warn('Failed to cleanup temp directory:', error.message);
	}
}

function main() {
	try {
		const results = readAllResults();

		if (results.length === 0) {
			console.warn('No license check results to aggregate');
			return;
		}

		// Generate console summary (without detailed dependencies)
		const consoleSummary = generateSummary(results, false);
		console.info(consoleSummary);

		// Create GitHub Actions Job Summary if available (with detailed dependencies)
		if (core && process.env.GITHUB_ACTIONS) {
			const gitHubSummary = generateSummary(results, true);
			core.summary.addRaw(gitHubSummary);
			core.summary.write();
			console.info('✅ GitHub Actions Job Summary created');
		}

		// Check if any packages failed and exit with error code
		const hasFailures = results.some((r) => !r.success);
		if (hasFailures) {
			console.error('\n❌ License check failed for one or more packages');
			process.exit(1);
		}

		console.info('\n✅ All license checks passed');
	} catch (error) {
		console.error('Failed to aggregate license results:', error);
		process.exit(1);
	} finally {
		cleanup();
	}
}

if (require.main === module) {
	main();
}

module.exports = { readAllResults, generateSummary, cleanup };
