/**
 * This script is used to check the licenses of the dependencies in the workspace.
 * If there's a dependency with a license that is not in the list of allowed licenses, the script will fail.
 *
 * It automatically discovers and excludes all workspace packages using pnpm.
 * It is used in the GitHub Actions workflow to ensure that the licenses of the dependencies are correct.
 * It is also used to add a comment to the PR with the results of the license check.
 *
 * To run the script, you can use the following command in the repository root:
 * pnpm check-licenses
 *
 */

const licenseChecker = require('license-checker-rseidelsohn');
const path = require('path');
const fs = require('fs');
const os = require('os');
const { execSync } = require('child_process');

// List of allowed licenses, if you want to allow more licenses, you can add them to the list
// If any of the installed dependencies has a license that is not in the list, the license check will fail
const ALLOWED_LICENSES = ['MIT', 'ISC', 'BSD-2-Clause', 'BSD-3-Clause', 'Apache-2.0', 'MPL-2.0'];

// List of dependencies that you want to ignore during the license check
// If you're excluding a dependency, make sure to add a comment explaining why it's excluded,
// and especially why we even can exclude it and not break any laws.
const excludedPackages = [];

// Name of the currently checked workspace
const { name } = require(path.resolve(process.cwd(), 'package.json'));

// Dynamically get all workspace projects using pnpm
function getWorkspaceProjects() {
	// Get all workspace packages using pnpm (from repo root)
	const output = execSync('pnpm m ls --json --depth -1', {
		encoding: 'utf8',
		cwd: path.resolve(__dirname, '..'),
	});
	const workspaceList = JSON.parse(output);

	// Extract package names from workspace
	const workspaceNames = workspaceList.map((pkg) => pkg.name).filter(Boolean);

	return workspaceNames;
}

const workspaceProjects = getWorkspaceProjects();

console.info(
	`📦 Excluding ${workspaceProjects.length} workspace packages: ${workspaceProjects.join(', ')} and ${excludedPackages.length} dependencies: ${excludedPackages.join(', ')}`
);

// Create temp directory for results aggregation
const tempDir = path.join(os.tmpdir(), 'license-check-results');
if (!fs.existsSync(tempDir)) {
	fs.mkdirSync(tempDir, { recursive: true });
}

licenseChecker.init(
	{
		start: process.cwd(),
		excludePackages: [...workspaceProjects, ...excludedPackages],
		onlyAllow: ALLOWED_LICENSES.join(';'),
		showLegend: true,
		json: true,
		summary: true,
		unknown: true,
	},
	(err, result) => {
		const packageResult = {
			packageName: name,
			success: !err,
			error: err?.message || null,
			result: result || null,
			timestamp: new Date().toISOString(),
		};

		// Write result to temp file for aggregation
		const resultFile = path.join(tempDir, `${name.replace('@', '').replace('/', '-')}.json`);
		fs.writeFileSync(resultFile, JSON.stringify(packageResult, null, 2));

		if (err) {
			console.error(`❌ ${name}: License check failed.`, err);
			process.exit(1);
		}
		console.info(`✅ ${name}: License check passed.\n\n`);

		console.info(JSON.stringify(result, null, 2));
	}
);
