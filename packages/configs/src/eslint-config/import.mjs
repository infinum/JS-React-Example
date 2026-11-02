import path from 'node:path';
import { createTypeScriptImportResolver } from 'eslint-import-resolver-typescript';
import { importX } from 'eslint-plugin-import-x';

// Absolute, so the resolver finds the package tsconfigs (and their `paths`) whatever directory ESLint runs from
const repoRoot = path.resolve(import.meta.dirname, '../../../..');

export default [
	{
		files: ['**/*.{js,jsx,ts,tsx,mjs,cjs,mts,cts}'],
		plugins: { 'import-x': importX },
		settings: {
			'import-x/resolver-next': [
				createTypeScriptImportResolver({
					project: path.join(repoRoot, '{apps,packages}/*/tsconfig.json'),
					noWarnOnMultipleProjects: true,
				}),
			],
		},
		rules: {
			'import-x/no-cycle': 'error',
			'import-x/no-self-import': 'error',
			// Every imported package must be declared in the importing package's package.json
			'import-x/no-extraneous-dependencies': 'error',
			'import-x/no-duplicates': 'error',
		},
	},
];
