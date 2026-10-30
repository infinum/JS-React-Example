const path = require('node:path');

const WORKSPACE_TOP_DIRS = ['apps', 'packages']; // customise if needed

// Extensions ESLint has a config for. Other files (Markdown, JSON, YAML...) only go through Prettier.
const LINTABLE_FILE = /\.(?:js|jsx|ts|tsx|mjs|cjs|mts|cts)$/;

/**
 * Builds the lint-staged commands for the staged files, grouped by workspace package.
 *
 * Every file is assigned to a bucket: `apps/<name>` or `packages/<name>` for files inside a workspace
 * package, `.` for everything else. Each package bucket runs that package's own ESLint and Prettier, so
 * its configs and binaries are used. Paths are passed as absolute paths, because `pnpm exec` runs inside
 * the package directory.
 *
 * @param {string[]} stagedAbsPaths Absolute paths of the staged files
 * @param {string} [cwd] Repository root
 * @returns {string[]} Commands for lint-staged to run
 */
function buildCommands(stagedAbsPaths, cwd = process.cwd()) {
	/** @type {{[bucket: string]: string[]}} */
	const buckets = {};

	for (const abs of stagedAbsPaths) {
		const rel = path.relative(cwd, abs).replace(/\\/g, '/'); // Windows-safe

		const [top, name] = rel.split('/');
		const bucket = WORKSPACE_TOP_DIRS.includes(top) && name ? `${top}/${name}` : '.';

		(buckets[bucket] ||= []).push(abs);
	}

	/** @type {string[]} */
	const commands = [];

	for (const [bucket, files] of Object.entries(buckets)) {
		const quote = (list) => list.map((p) => `"${p}"`).join(' ');
		const lintable = files.filter((file) => LINTABLE_FILE.test(file));
		// A path filter needs the leading `./`. Without it pnpm matches package names, finds none and exits 0.
		const exec = bucket === '.' ? '' : `pnpm --filter ./${bucket} exec `;

		if (lintable.length) {
			commands.push(`${exec}eslint --no-warn-ignored --max-warnings 0 ${quote(lintable)}`);
		}
		commands.push(`${exec}prettier --check --ignore-unknown ${quote(files)}`);
	}

	// If every staged file was e.g. a lock-file, regard that as OK:
	return commands.length ? commands : ['echo "nothing to lint"'];
}

module.exports = { buildCommands };
