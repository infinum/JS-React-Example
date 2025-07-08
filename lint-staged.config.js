const path = require('node:path');

const WORKSPACE_TOP_DIRS = ['apps', 'packages']; // customise if needed

/**
 * @type {import('lint-staged').Configuration}
 */
module.exports = {
	'*': (stagedAbsPaths) => {
		/** @type {{[bucket: string]: string[]}} */
		const buckets = {};
		// For each staged file, we need to determine which bucket it belongs to.
		// The bucket is the directory that contains the file.
		// If the file is in the root directory, the bucket is '.', otherwise it's the directory that contains the file.
		// For example, if the file is in apps/frontend/src/components/button.tsx, the bucket is 'apps/frontend'.
		// If the file is in packages/ui/src/components/button.tsx, the bucket is 'packages/ui'.
		// If the file is in the root directory, the bucket is '.'.
		for (const abs of stagedAbsPaths) {
			const rel = path.relative(process.cwd(), abs).replace(/\\/g, '/'); // Windows-safe

			const [top, name] = rel.split('/');
			const bucket = WORKSPACE_TOP_DIRS.includes(top) && name ? `${top}/${name}` : '.';

			(buckets[bucket] ||= []).push(rel);
		}

		/** @type {string[]} */
		const commands = [];

		for (const [bucket, files] of Object.entries(buckets)) {
			const f = files.map((p) => `"${p}"`).join(' '); // quote every path

			// Linting the root level files
			if (bucket === '.') {
				commands.push(`eslint --cache ${f}`);
				commands.push(`prettier --check ${f}`);
				// Linting the files in apps/packages (workspaces aka buckets)
			} else {
				commands.push(`pnpm --filter ${bucket} exec eslint --cache ${f}`);
				commands.push(`pnpm --filter ${bucket} exec prettier ${f}`);
			}
		}

		// If every staged file was e.g. a lock-file, regard that as OK:
		return commands.length ? commands : ['echo "nothing to lint"'];
	},
};
