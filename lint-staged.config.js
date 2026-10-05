const path = require('node:path');
const fs = require('node:fs');

const WORKSPACE_TOP_DIRS = ['apps', 'packages']; // customise if needed

/**
 * @type {import('lint-staged').Configuration}
 */
module.exports = {
	'*': (stagedAbsPaths) => {
		const shouldFix = !process.env.DISABLE_LINTERS_AUTO_FIX;

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
			// Linting the root level files
			if (bucket === '.') {
				const f = files.map((p) => `"${p}"`).join(' '); // quote every path
				const eslintCmd = shouldFix ? `eslint --cache --fix ${f}` : `eslint --cache ${f}`;
				const prettierMode = shouldFix ? '--write' : '--check';
				commands.push(eslintCmd);
				commands.push(`prettier ${prettierMode} ${f}`);
			} else {
				// Run linting from the root directory with workspace-specific configs
				const workspaceFiles = files.map((p) => `"${p}"`).join(' ');
				const workspaceConfig = `${bucket}/eslint.config.mjs`;
				const workspacePrettier = `${bucket}/.prettierrc.js`;

				const eslintCmd = shouldFix
					? `eslint --config ${workspaceConfig} --cache --fix ${workspaceFiles}`
					: `eslint --config ${workspaceConfig} --cache ${workspaceFiles}`;
				commands.push(eslintCmd);
				const workspacePrettierIgnore = `${bucket}/.prettierignore`;
				const prettierIgnorePath = fs.existsSync(workspacePrettierIgnore) ? workspacePrettierIgnore : '.prettierignore';
				const prettierMode = shouldFix ? '--write' : '--check';
				commands.push(
					`prettier --config ${workspacePrettier} --ignore-path ${prettierIgnorePath} ${prettierMode} ${workspaceFiles}`
				);
			}
		}

		// If every staged file was e.g. a lock-file, regard that as OK:
		return commands.length ? commands : ['echo "nothing to lint"'];
	},
};
