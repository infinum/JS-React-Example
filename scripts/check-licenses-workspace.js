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
//
// NOTE: matching is a plain substring test (`currentLicense.includes(allowed)`), not SPDX
// parsing. So "MIT" also permits "MIT-0" and "(MIT OR Apache-2.0)". It is case-sensitive,
// which is why "Unlicense" (public domain) does not accidentally permit "UNLICENSED"
// (proprietary, no rights granted).
//
// Every license below is permissive or public-domain: attribution/notice retention at most,
// no copyleft or source-disclosure obligation for a distributed web app.
const ALLOWED_LICENSES = [
	'MIT',
	'ISC',
	'BSD-2-Clause',
	'BSD-3-Clause',
	'Apache-2.0',
	'MPL-2.0',
	// BSD Zero Clause - permissive, not even a notice requirement. Required by: tslib.
	'0BSD',
	// OSI-approved permissive, the license the npm/isaacs packages migrated to.
	// Required by: glob, tar, minipass, lru-cache, path-scurry, minimatch, isexe,
	// chownr, yallist, jackspeak, common-ancestor-path, package-json-from-dist.
	'BlueOak-1.0.0',
	// Python Software Foundation License 2.0 - OSI-approved permissive, GPL-compatible.
	// Required by: argparse (a port of Python's argparse, hence the license).
	'Python-2.0',
	// Public domain dedications. Required by: fs-monkey, memfs (Unlicense),
	// spdx-license-ids (CC0-1.0).
	'Unlicense',
	'CC0-1.0',
	// Attribution-only data licenses, no share-alike/non-commercial terms.
	// These cover data tables rather than code. Required by: caniuse-lite (CC-BY-4.0),
	// spdx-exceptions (CC-BY-3.0).
	'CC-BY-3.0',
	'CC-BY-4.0',
	// OSI-approved permissive. Required by: domain-browser.
	'Artistic-2.0',
];

// List of dependencies that you want to ignore during the license check
// If you're excluding a dependency, make sure to add a comment explaining why it's excluded,
// and especially why we even can exclude it and not break any laws.
const excludedPackages = [
	// Declares "license": "SEE LICENSE IN LICENSE", which is valid but not an SPDX id, so the
	// checker reports it as "Custom: LICENSE" and cannot classify it. Its LICENSE file is
	// verbatim MIT (Copyright (c) 2017-present James Kyle) - only the "MIT License" heading
	// is missing, which is what defeats the automatic detection. Verified by reading the file;
	// re-verify on upgrade, since this bypasses the check entirely rather than reclassifying it.
	'spawndamnit@3.0.1',
];

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
