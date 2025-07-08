/**
 * Aggregates Jest coverage-summary.json files from all workspace packages
 * and outputs a GitHub Actions Job Summary.
 */

const fs = require('fs');
const path = require('path');

// Try to load @actions/core if we're in GH Actions
let core;
if (process.env.GITHUB_ACTIONS) {
	try {
		core = require('@actions/core');
	} catch {
		console.warn('⚠️  @actions/core not found');
	}
}

// Where all your per-package coverage summaries live:
const COVERAGE_ROOT = path.join(process.cwd(), 'coverage');

/**
 * Read every coverage-summary.json under coverage/<pkg>/coverage-summary.json
 * Returns an array of { packageName, summary: { lines, statements, functions, branches } }
 */
function readAllCoverage() {
	if (!fs.existsSync(COVERAGE_ROOT)) {
		console.warn('⚠️  coverage/ directory not found');
		return [];
	}

	return fs
		.readdirSync(COVERAGE_ROOT)
		.filter((name) => {
			const dir = path.join(COVERAGE_ROOT, name);
			return fs.statSync(dir).isDirectory();
		})
		.map((pkg) => {
			const file = path.join(COVERAGE_ROOT, pkg, 'coverage-summary.json');
			if (!fs.existsSync(file)) {
				console.warn(`⚠️  Missing coverage-summary.json for package ${pkg}`);
				return null;
			}
			try {
				const data = JSON.parse(fs.readFileSync(file, 'utf8'));
				return { packageName: pkg, summary: data.total };
			} catch (err) {
				console.warn(`⚠️  Failed to parse ${file}: ${err.message}`);
				return null;
			}
		})
		.filter(Boolean)
		.sort((a, b) => a.packageName.localeCompare(b.packageName));
}

/**
 * Build a Markdown summary.
 *
 * @param {Array} results
 * @param {boolean} isGitHubActions
 * @returns {string}
 */
function generateSummary(results) {
	let md = '# 📊 Coverage Summary\n\n';

	if (results.length === 0) {
		md += '_No coverage summaries found._\n\n';
		return md;
	}

	const metrics = ['lines', 'statements', 'functions', 'branches'];

	// Per‐package table
	md += '## Per-Package Coverage\n\n';
	md += '| Package | ' + metrics.map((m) => `${m[0].toUpperCase() + m.slice(1)} %`).join(' | ') + ' |\n';
	md += '| ------- | ' + metrics.map(() => '--------:').join(' | ') + ' |\n';

	results.forEach(({ packageName, summary }) => {
		const row = metrics
			.map((m) => {
				const pct = summary[m]?.pct;
				return pct != null ? `${pct.toFixed(2)}%` : 'N/A';
			})
			.join(' | ');
		md += `| \`${packageName}\` | ${row} |\n`;
	});

	// Averages
	md += '\n## Average Coverage\n\n';
	md += '| Metric | Average % |\n';
	md += '| ------ | --------: |\n';
	metrics.forEach((m) => {
		const vals = results.map((r) => r.summary[m]?.pct).filter((v) => typeof v === 'number');
		const avg = vals.length ? (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(2) : 'N/A';
		md += `| ${m[0].toUpperCase() + m.slice(1)} | ${avg}% |\n`;
	});

	md += '\n---\n';
	md += `Generated at: ${new Date().toISOString()}\n`;

	return md;
}

function main() {
	const results = readAllCoverage();

	// 1) Console output
	const consoleMd = generateSummary(results);
	console.info(consoleMd);

	// 2) GitHub Actions job summary
	if (core) {
		const ghMd = generateSummary(results);
		core.summary.addRaw(ghMd).write();
		console.info('✅ Coverage summary written to GitHub Actions job summary');
	}
}

if (require.main === module) {
	main();
}

module.exports = { readAllCoverage, generateSummary };
