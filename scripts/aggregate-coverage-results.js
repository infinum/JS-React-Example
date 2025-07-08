/**
 * Aggregates Jest coverage-summary.json files from all workspace packages.
 *
 * Generates:
 * 1. GitHub Actions Job Summary (if running in CI)
 * 2. Combined coverage-summary.json for PR comment actions
 */

const fs = require('fs');
const path = require('path');

// ============================================================================
// Constants
// ============================================================================

const COVERAGE_METRICS = ['statements', 'branches', 'functions', 'lines'];
const COVERAGE_ROOT = path.join(process.cwd(), 'coverage');
const COVERAGE_SUMMARY_FILE = 'coverage-summary.json';
const SINGLE_REPO_PACKAGE_NAME = 'root';
const PERCENTAGE_MULTIPLIER = 100;
const PERCENTAGE_DECIMAL_PLACES = 2;

const IS_MONOREPO = process.env.MONOREPO === 'true';

// ============================================================================
// GitHub Actions Integration
// ============================================================================

let core;
if (process.env.GITHUB_ACTIONS) {
	try {
		core = require('@actions/core');
	} catch {
		console.warn('⚠️  @actions/core not found');
	}
}

// ============================================================================
// File I/O Helpers
// ============================================================================

/**
 * Safely reads and parses a JSON file.
 * @param {string} filePath - Path to the JSON file
 * @returns {object|null} Parsed JSON data or null on error
 */
function readJsonFile(filePath) {
	if (!fs.existsSync(filePath)) {
		return null;
	}
	try {
		const content = fs.readFileSync(filePath, 'utf8');
		return JSON.parse(content);
	} catch (err) {
		console.warn(`⚠️  Failed to parse ${filePath}: ${err.message}`);
		return null;
	}
}

/**
 * Checks if a path is a directory.
 * @param {string} dirPath - Path to check
 * @returns {boolean}
 */
function isDirectory(dirPath) {
	try {
		return fs.statSync(dirPath).isDirectory();
	} catch {
		return false;
	}
}

// ============================================================================
// Coverage Data Reading
// ============================================================================

/**
 * Reads coverage data from a single package directory.
 * @param {string} rootDir - Root coverage directory
 * @param {string} packageName - Package directory name
 * @returns {object|null} Coverage data or null on error
 */
function readPackageCoverage(rootDir, packageName) {
	const summaryPath = path.join(rootDir, packageName, COVERAGE_SUMMARY_FILE);
	const data = readJsonFile(summaryPath);
	if (!data) {
		console.warn(`⚠️  Missing ${COVERAGE_SUMMARY_FILE} for package ${packageName} under ${rootDir}`);
		return null;
	}
	return { packageName, summary: data.total, files: data };
}

/**
 * Reads coverage from all packages in a monorepo structure.
 * @param {string} rootDir - Root coverage directory
 * @returns {Array<object>} Array of coverage data per package
 */
function readMonorepoCoverage(rootDir) {
	if (!fs.existsSync(rootDir)) {
		console.warn(`⚠️  coverage directory not found at ${rootDir}`);
		return [];
	}

	const packages = fs
		.readdirSync(rootDir)
		.filter((name) => isDirectory(path.join(rootDir, name)))
		.map((pkg) => readPackageCoverage(rootDir, pkg))
		.filter(Boolean)
		.sort((a, b) => a.packageName.localeCompare(b.packageName));

	return packages;
}

/**
 * Reads coverage for a single repository (root-level coverage-summary.json).
 * @returns {Array<object>} Array with single entry for root package
 */
function readSingleRepoCoverage() {
	const summaryPath = path.join(COVERAGE_ROOT, COVERAGE_SUMMARY_FILE);
	const data = readJsonFile(summaryPath);
	if (!data) {
		console.warn(`⚠️  ${COVERAGE_SUMMARY_FILE} not found at ${summaryPath}`);
		return [];
	}
	return [{ packageName: SINGLE_REPO_PACKAGE_NAME, summary: data.total, files: data }];
}

/**
 * Reads all coverage data based on repository type.
 * @returns {Array<object>} Array of coverage data
 */
function readAllCoverage() {
	return IS_MONOREPO ? readMonorepoCoverage(COVERAGE_ROOT) : readSingleRepoCoverage();
}

// ============================================================================
// Markdown Generation
// ============================================================================

/**
 * Formats a percentage value for display.
 * @param {number|null|undefined} value - Percentage value
 * @returns {string} Formatted percentage or 'N/A'
 */
function formatPercentage(value) {
	if (typeof value !== 'number' || Number.isNaN(value)) {
		return 'N/A';
	}
	return `${value.toFixed(PERCENTAGE_DECIMAL_PLACES)}%`;
}

/**
 * Capitalizes the first letter of a string.
 * @param {string} str - String to capitalize
 * @returns {string} Capitalized string
 */
function capitalize(str) {
	if (!str || typeof str !== 'string' || str.length === 0) {
		return str;
	}
	return str[0].toUpperCase() + str.slice(1);
}

/**
 * Builds a markdown table row for coverage metrics.
 * @param {object} summary - Coverage summary object
 * @returns {string} Markdown table row
 */
function buildCoverageRow(summary) {
	return COVERAGE_METRICS.map((metric) => formatPercentage(summary[metric]?.pct)).join(' | ');
}

/**
 * Builds a markdown table header for coverage metrics.
 * @returns {string} Markdown table header row
 */
function buildCoverageHeader() {
	return '| Package | ' + COVERAGE_METRICS.map((m) => `${capitalize(m)} %`).join(' | ') + ' |\n';
}

/**
 * Builds a markdown table separator row.
 * @returns {string} Markdown table separator
 */
function buildTableSeparator() {
	return '| ------- | ' + COVERAGE_METRICS.map(() => '--------:').join(' | ') + ' |\n';
}

/**
 * Builds file-level coverage details for a single package.
 * @param {string} packageName - Package name
 * @param {object} files - File coverage data
 * @returns {string|null} Markdown section or null if no files
 */
function buildPackageFileDetails(packageName, files) {
	if (!files) {
		return null;
	}

	const fileEntries = Object.entries(files).filter(([name]) => name !== 'total');
	if (fileEntries.length === 0) {
		return null;
	}

	let section = `<details>\n<summary>📁 ${packageName} file coverage</summary>\n\n`;
	section += '| File | ' + COVERAGE_METRICS.map((m) => `${capitalize(m)} %`).join(' | ') + ' |\n';
	section += '| ---- | ' + COVERAGE_METRICS.map(() => '--------:').join(' | ') + ' |\n';

	fileEntries.forEach(([filePath, data]) => {
		const row = COVERAGE_METRICS.map((m) => formatPercentage(data[m]?.pct)).join(' | ');
		section += `| \`${filePath}\` | ${row} |\n`;
	});

	section += '\n</details>\n';
	return section;
}

/**
 * Builds file-level coverage details for all packages.
 * @param {Array<object>} results - Coverage results
 * @returns {string} Combined markdown sections
 */
function buildFileDetails(results) {
	const sections = results.map(({ packageName, files }) => buildPackageFileDetails(packageName, files)).filter(Boolean);

	return sections.length ? sections.join('\n') : '';
}

/**
 * Generates a markdown summary of coverage data.
 * @param {Array<object>} results - Coverage results
 * @returns {string} Markdown summary
 */
function generateSummary(results) {
	if (results.length === 0) {
		return '# 📊 Coverage Summary\n\n_No coverage summaries found._\n\n';
	}

	let md = '# 📊 Coverage Summary\n\n';
	md += '## Per-Package Coverage\n\n';
	md += buildCoverageHeader();
	md += buildTableSeparator();

	results.forEach(({ packageName, summary }) => {
		md += `| \`${packageName}\` | ${buildCoverageRow(summary)} |\n`;
	});

	md += '\n---\n';
	md += `Generated at: ${new Date().toISOString()}\n`;

	const fileDetails = buildFileDetails(results);
	if (fileDetails) {
		md += '\n' + fileDetails;
	}

	return md;
}

// ============================================================================
// Coverage Aggregation
// ============================================================================

/**
 * Calculates combined totals for a single metric across all packages.
 * @param {string} metric - Metric name (e.g., 'lines', 'statements')
 * @param {Array<object>} results - Coverage results
 * @returns {object} Aggregated metric data
 */
function calculateMetricTotal(metric, results) {
	let totalCount = 0;
	let coveredCount = 0;
	let skippedCount = 0;

	results.forEach(({ summary }) => {
		const m = summary[metric];
		if (m && typeof m.total === 'number') {
			totalCount += m.total;
			coveredCount += m.covered || 0;
			skippedCount += m.skipped || 0;
		}
	});

	const pct = totalCount > 0 ? (coveredCount / totalCount) * PERCENTAGE_MULTIPLIER : 0;

	return {
		total: totalCount,
		covered: coveredCount,
		skipped: skippedCount,
		pct: Math.round(pct * PERCENTAGE_MULTIPLIER) / PERCENTAGE_MULTIPLIER,
	};
}

/**
 * Generates a combined coverage-summary.json matching Jest's format.
 * @param {Array<object>} results - Coverage results
 * @returns {object|null} Combined coverage data or null if no results
 */
function generateCombinedCoverageSummary(results) {
	if (results.length === 0) {
		return null;
	}

	const total = {};
	COVERAGE_METRICS.forEach((metric) => {
		total[metric] = calculateMetricTotal(metric, results);
	});

	// Add branchesTrue if it exists in any package (use first occurrence)
	// Note: This assumes all packages have the same branchesTrue structure if present
	const branchesTrue = results.find((r) => r.summary.branchesTrue && typeof r.summary.branchesTrue.total === 'number')
		?.summary.branchesTrue;
	if (branchesTrue) {
		total.branchesTrue = branchesTrue;
	}

	return { total };
}

// ============================================================================
// Main Execution
// ============================================================================

/**
 * Writes coverage summary to GitHub Actions job summary.
 * @param {string} markdown - Markdown content
 */
function writeGitHubSummary(markdown) {
	if (core) {
		core.summary.addRaw(markdown).write();
		console.info('✅ Coverage summary written to GitHub Actions job summary');
	}
}

/**
 * Writes combined coverage-summary.json to disk.
 * @param {object} combined - Combined coverage data
 */
function writeCombinedSummary(combined) {
	const outputPath = path.join(COVERAGE_ROOT, COVERAGE_SUMMARY_FILE);
	fs.writeFileSync(outputPath, JSON.stringify(combined, null, 2), 'utf8');
	console.info(`✅ Combined ${COVERAGE_SUMMARY_FILE} written to ${outputPath}`);
}

function main() {
	const results = readAllCoverage();
	const summary = generateSummary(results);

	// 1) Console output
	console.info(summary);

	// 2) GitHub Actions job summary
	writeGitHubSummary(summary);

	// 3) Generate combined coverage-summary.json for PR comment actions
	const combined = generateCombinedCoverageSummary(results);
	if (combined) {
		writeCombinedSummary(combined);
	} else {
		console.warn('⚠️  No coverage data to combine');
	}
}

if (require.main === module) {
	main();
}

module.exports = { readAllCoverage, readMonorepoCoverage, generateSummary };
