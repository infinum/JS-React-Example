/**
 * Posts coverage comparison comments on pull requests.
 * Compares current PR coverage against base branch coverage.
 */

const fs = require('fs');
const path = require('path');

const { readMonorepoCoverage } = require('./aggregate-coverage-results');

// ============================================================================
// Constants
// ============================================================================

const COVERAGE_METRICS = ['statements', 'branches', 'functions', 'lines'];
const COVERAGE_SUMMARY_FILE = 'coverage-summary.json';
const MARKER = '<!-- coverage-diff -->';
const SINGLE_REPO_PACKAGE_NAME = 'root';
const PERCENTAGE_DECIMAL_PLACES = 2;
const IS_MONOREPO = process.env.MONOREPO === 'true';
const BASE_BRANCH_NAME = process.env.BASE_BRANCH || 'main';

// ============================================================================
// Configuration
// ============================================================================

/**
 * Resolves coverage root paths based on repository type.
 * @returns {{prRoot: string, baseRoot: string}}
 */
function resolveCoveragePaths() {
	const prRoot = path.resolve(process.env.PR_COVERAGE_ROOT || 'coverage');

	// Base coverage artifact structure differs by repo type:
	// - Monorepo: base-coverage/coverage/{package}/coverage-summary.json
	// - Single repo: base-coverage/coverage-summary.json
	const baseRootDefault = IS_MONOREPO ? path.join('base-coverage', 'coverage') : 'base-coverage';
	const baseRoot = path.resolve(process.env.BASE_COVERAGE_ROOT || baseRootDefault);

	return { prRoot, baseRoot };
}

// ============================================================================
// Data Loading
// ============================================================================

/**
 * Loads totals from a coverage-summary.json file.
 * @param {string} filePath - Path to coverage-summary.json
 * @returns {object|null} Coverage totals or null on error
 */
function loadTotals(filePath) {
	if (!filePath || !fs.existsSync(filePath)) {
		return null;
	}

	try {
		const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
		return data.total || null;
	} catch (err) {
		console.warn(`⚠️  Failed to read coverage file ${filePath}: ${err.message}`);
		return null;
	}
}

/**
 * Reads coverage packages from a directory.
 * @param {string} rootDir - Root coverage directory
 * @returns {Array<object>} Array of package coverage data
 */
function readCoveragePackages(rootDir) {
	if (IS_MONOREPO) {
		return readMonorepoCoverage(rootDir);
	}

	// Single repo: read root coverage-summary.json
	const summaryPath = path.join(rootDir, COVERAGE_SUMMARY_FILE);
	const data = loadTotals(summaryPath);
	if (!data) {
		return [];
	}
	return [{ packageName: SINGLE_REPO_PACKAGE_NAME, summary: data }];
}

// ============================================================================
// Formatting Helpers
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
 * Formats a delta value with arrow indicator.
 * @param {number|null|undefined} deltaValue - Delta percentage
 * @returns {string} Formatted delta (e.g., "▲ 1.23%" or "▼ 0.50%")
 */
function formatDelta(deltaValue) {
	if (deltaValue == null || typeof deltaValue !== 'number' || Number.isNaN(deltaValue)) {
		return 'N/A';
	}
	if (deltaValue === 0) {
		return `0.${'0'.repeat(PERCENTAGE_DECIMAL_PLACES)}%`;
	}
	const arrow = deltaValue > 0 ? '▲' : '▼';
	return `${arrow} ${Math.abs(deltaValue).toFixed(PERCENTAGE_DECIMAL_PLACES)}%`;
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

// ============================================================================
// Markdown Generation
// ============================================================================

/**
 * Builds the main coverage diff table (total coverage).
 * @param {object|null} headTotals - PR coverage totals
 * @param {object|null} baseTotals - Base branch coverage totals
 * @returns {string} Markdown table
 */
function buildDiffTable(headTotals, baseTotals) {
	let md = `| Metric | PR | ${BASE_BRANCH_NAME} | Δ |\n`;
	md += '| ------ | ---: | ---: | ---: |\n';

	COVERAGE_METRICS.forEach((metric) => {
		const head = headTotals?.[metric]?.pct;
		const base = baseTotals?.[metric]?.pct;
		const delta = typeof head === 'number' && typeof base === 'number' ? head - base : null;

		md += `| ${capitalize(metric)} | ${formatPercentage(head)} | ${formatPercentage(base)} | ${formatDelta(delta)} |\n`;
	});

	return md;
}

/**
 * Builds a per-package coverage comparison table.
 * @param {Array<object>} prPackages - PR package coverage data
 * @param {Array<object>} basePackages - Base branch package coverage data
 * @returns {string|null} Markdown table or null if no packages
 */
function buildPerPackageTable(prPackages, basePackages) {
	if (!Array.isArray(prPackages) || prPackages.length === 0) {
		return null;
	}

	// Create lookup map for base packages
	const baseMap = new Map((basePackages || []).map((pkg) => [pkg.packageName, pkg.summary]));

	// Collect all unique package names from both PR and base
	const allPackageNames = new Set([
		...prPackages.map((pkg) => pkg.packageName),
		...(basePackages || []).map((pkg) => pkg.packageName),
	]);
	const sortedNames = Array.from(allPackageNames).sort();

	if (sortedNames.length === 0) {
		return null;
	}

	let md = `| Package | Metric | PR | ${BASE_BRANCH_NAME} | Δ |\n`;
	md += '| ------- | ------ | ---: | ---: | ---: |\n';

	sortedNames.forEach((packageName) => {
		const prSummary = prPackages.find((pkg) => pkg.packageName === packageName)?.summary;
		const baseSummary = baseMap.get(packageName);

		COVERAGE_METRICS.forEach((metric, metricIndex) => {
			const prPct = prSummary?.[metric]?.pct;
			const basePct = baseSummary?.[metric]?.pct;
			const deltaValue = typeof prPct === 'number' && typeof basePct === 'number' ? prPct - basePct : null;
			const packageLabel = metricIndex === 0 ? `\`${packageName}\`` : '';

			md += `| ${packageLabel} | ${capitalize(metric)} | ${formatPercentage(prPct)} | ${formatPercentage(
				basePct
			)} | ${formatDelta(deltaValue)} |\n`;
		});
	});

	return md;
}

/**
 * Builds the complete comment body.
 * @param {object|null} headTotals - PR coverage totals
 * @param {object|null} baseTotals - Base branch coverage totals
 * @param {Array<object>} prPackages - PR package coverage data
 * @param {Array<object>} basePackages - Base branch package coverage data
 * @returns {string} Complete markdown comment body
 */
function buildCommentBody(headTotals, baseTotals, prPackages, basePackages) {
	let body = '## Coverage diff\n\n';
	body += buildDiffTable(headTotals, baseTotals);

	if (!baseTotals) {
		body += '\n_Base coverage artifact missing; only PR coverage is shown._\n';
	}

	// Only show per-package delta for monorepos
	if (IS_MONOREPO) {
		const perPackageDiff = buildPerPackageTable(prPackages, basePackages);
		if (perPackageDiff) {
			body += '\n<details>\n<summary>🧮 Per-package delta</summary>\n\n\n';
			body += perPackageDiff;
			body += '\n</details>\n';
		}
	}

	return body;
}

// ============================================================================
// GitHub API Integration
// ============================================================================

/**
 * Fetches existing PR comments.
 * @param {string} commentsUrl - GitHub API comments URL
 * @param {object} headers - Request headers
 * @returns {Promise<Array>} Array of comments
 */
async function fetchComments(commentsUrl, headers) {
	const res = await fetch(`${commentsUrl}?per_page=100`, { headers });
	if (!res.ok) {
		throw new Error(`Failed to list PR comments: ${res.status} ${await res.text()}`);
	}
	return res.json();
}

/**
 * Finds an existing coverage comment by marker.
 * @param {Array} comments - Array of PR comments
 * @returns {object|undefined} Existing comment or undefined
 */
function findExistingComment(comments) {
	return comments.find((comment) => typeof comment.body === 'string' && comment.body.startsWith(MARKER));
}

/**
 * Updates an existing PR comment.
 * @param {string} commentUrl - Comment API URL
 * @param {string} body - New comment body
 * @param {object} headers - Request headers
 * @returns {Promise<object>} Updated comment
 */
async function updateComment(commentUrl, body, headers) {
	const res = await fetch(commentUrl, {
		method: 'PATCH',
		headers,
		body: JSON.stringify({ body }),
	});
	if (!res.ok) {
		throw new Error(`Failed to update comment: ${res.status} ${await res.text()}`);
	}
	return res.json();
}

/**
 * Creates a new PR comment.
 * @param {string} commentsUrl - GitHub API comments URL
 * @param {string} body - Comment body
 * @param {object} headers - Request headers
 * @returns {Promise<object>} Created comment
 */
async function createComment(commentsUrl, body, headers) {
	const res = await fetch(commentsUrl, {
		method: 'POST',
		headers,
		body: JSON.stringify({ body }),
	});
	if (!res.ok) {
		throw new Error(`Failed to create comment: ${res.status} ${await res.text()}`);
	}
	return res.json();
}

/**
 * Upserts a coverage comment on a pull request.
 * @param {string} body - Comment body
 * @param {string} token - GitHub token
 * @param {string} repo - Repository (owner/repo)
 * @param {number} prNumber - Pull request number
 */
async function upsertComment(body, token, repo, prNumber) {
	const apiBase = process.env.GITHUB_API_URL || 'https://api.github.com';
	const headers = {
		Accept: 'application/vnd.github+json',
		Authorization: `Bearer ${token}`,
		'X-GitHub-Api-Version': '2022-11-28',
	};

	const commentsUrl = `${apiBase}/repos/${repo}/issues/${prNumber}/comments`;
	const markerBody = `${MARKER}\n${body}`;

	const comments = await fetchComments(commentsUrl, headers);
	const existing = findExistingComment(comments);

	if (existing) {
		const updated = await updateComment(existing.url, markerBody, headers);
		console.info(`✅ Updated existing coverage comment: ${updated.html_url}`);
	} else {
		const created = await createComment(commentsUrl, markerBody, headers);
		console.info(`✅ Posted coverage comment: ${created.html_url}`);
	}
}

// ============================================================================
// Main Execution
// ============================================================================

async function main() {
	const token = process.env.GITHUB_TOKEN;
	const repo = process.env.GITHUB_REPOSITORY;
	const prNumber = process.env.PR_NUMBER;

	if (!token) {
		throw new Error('Missing required environment variable: GITHUB_TOKEN');
	}
	if (!repo) {
		throw new Error('Missing required environment variable: GITHUB_REPOSITORY');
	}
	if (!prNumber) {
		throw new Error('Missing required environment variable: PR_NUMBER');
	}

	const { prRoot, baseRoot } = resolveCoveragePaths();
	const prCoveragePath = path.join(prRoot, COVERAGE_SUMMARY_FILE);
	const baseCoveragePath = path.join(baseRoot, COVERAGE_SUMMARY_FILE);

	const headTotals = loadTotals(prCoveragePath);
	if (!headTotals) {
		console.warn('⚠️  Could not read PR coverage totals; skipping comment');
		return;
	}

	const baseTotals = loadTotals(baseCoveragePath);
	const prPackages = readCoveragePackages(prRoot);
	const basePackages = readCoveragePackages(baseRoot);

	const body = buildCommentBody(headTotals, baseTotals, prPackages, basePackages);
	await upsertComment(body, token, repo, prNumber);
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
