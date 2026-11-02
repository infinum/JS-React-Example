const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { describe, it } = require('node:test');

const script = path.join(__dirname, '..', 'aggregate-license-results.js');

// Writes the per-package result files check-licenses-workspace.js would write, then runs the aggregation
const aggregate = (results) => {
	const resultsDir = fs.mkdtempSync(path.join(os.tmpdir(), 'license-results-test-'));
	for (const result of results) {
		fs.writeFileSync(path.join(resultsDir, `${result.packageName}.json`), JSON.stringify(result));
	}

	const { status } = spawnSync(process.execPath, [script], {
		env: { ...process.env, LICENSE_RESULTS_DIR: resultsDir, GITHUB_ACTIONS: '' },
		encoding: 'utf8',
	});

	return { status, resultsDirExists: fs.existsSync(resultsDir) };
};

const passed = { packageName: 'ui', success: true, error: null, result: {} };
const failed = { packageName: 'frontend', success: false, error: 'GPL-3.0 is not allowed', result: null };

describe('aggregate-license-results', () => {
	it('exits with 0 when every package passed', () => {
		assert.equal(aggregate([passed]).status, 0);
	});

	it('exits with 1 when a package failed', () => {
		assert.equal(aggregate([passed, failed]).status, 1);
	});

	it("removes the run's results after a failure, so they can't leak into the next run", () => {
		assert.equal(aggregate([failed]).resultsDirExists, false);
	});
});
