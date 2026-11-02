const assert = require('node:assert/strict');
const { describe, it } = require('node:test');

const { buildChangedFilesTable, buildCommentBody, selectChangedFileCoverage } = require('../comment-coverage-diff');

const metrics = (pct) => ({
	lines: { pct },
	statements: { pct },
	branches: { pct },
	functions: { pct },
});

const packages = [
	{
		packageName: 'frontend',
		summary: metrics(50),
		files: {
			total: metrics(50),
			'/repo/apps/frontend/src/proxy.ts': metrics(90),
			'/repo/apps/frontend/src/lib/env/index.ts': metrics(0),
		},
	},
	{
		packageName: 'storybook',
		summary: metrics(100),
		files: { total: metrics(100), '/repo/packages/ui/src/components/button.tsx': metrics(100) },
	},
	{
		packageName: 'ui',
		summary: metrics(75),
		files: { total: metrics(75), '/repo/packages/ui/src/components/button.tsx': metrics(80) },
	},
];

describe('selectChangedFileCoverage', () => {
	it('keeps only the changed files, one row per package that measures them', () => {
		const changed = new Set(['apps/frontend/src/proxy.ts', 'packages/ui/src/components/button.tsx', 'README.md']);

		const rows = selectChangedFileCoverage(packages, changed, '/repo');

		assert.deepEqual(
			rows.map(({ file, packageName }) => [file, packageName]),
			[
				['apps/frontend/src/proxy.ts', 'frontend'],
				['packages/ui/src/components/button.tsx', 'storybook'],
				['packages/ui/src/components/button.tsx', 'ui'],
			]
		);
	});

	it('ignores the totals entry', () => {
		const rows = selectChangedFileCoverage(packages, new Set(['total']), '/repo');

		assert.deepEqual(rows, []);
	});
});

describe('buildChangedFilesTable', () => {
	it('lists lines, branches and functions per changed file', () => {
		const rows = selectChangedFileCoverage(packages, new Set(['apps/frontend/src/proxy.ts']), '/repo');

		assert.match(
			buildChangedFilesTable(rows),
			/\| `apps\/frontend\/src\/proxy.ts` \| `frontend` \| 90.00% \| 90.00% \| 90.00% \|/
		);
	});

	it('says so when no changed file is measured', () => {
		assert.match(buildChangedFilesTable([]), /No changed source files/);
	});
});

describe('buildCommentBody', () => {
	it('adds the changed files section only when the changed files are known', () => {
		const withRows = buildCommentBody(metrics(50), metrics(40), [], [], []);
		const withoutRows = buildCommentBody(metrics(50), metrics(40), [], [], null);

		assert.match(withRows, /### Changed files/);
		assert.doesNotMatch(withoutRows, /### Changed files/);
	});
});
