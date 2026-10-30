const assert = require('node:assert/strict');
const { describe, it } = require('node:test');

const { buildCommands } = require('../lint-staged-commands');

const root = '/repo';

describe('buildCommands', () => {
	it('selects workspace packages by path, not by name', () => {
		const commands = buildCommands(['/repo/apps/frontend/src/page.tsx'], root);

		assert.deepEqual(commands, [
			'pnpm --filter ./apps/frontend exec eslint --no-warn-ignored --max-warnings 0 "/repo/apps/frontend/src/page.tsx"',
			'pnpm --filter ./apps/frontend exec prettier --check --ignore-unknown "/repo/apps/frontend/src/page.tsx"',
		]);
	});

	it('checks formatting instead of only printing it', () => {
		const commands = buildCommands(['/repo/packages/ui/src/utils/cn.ts', '/repo/README.md'], root);

		for (const command of commands.filter((c) => c.includes('prettier'))) {
			assert.match(command, /prettier --check /);
		}
	});

	it('sends only JS and TS files to ESLint', () => {
		const commands = buildCommands(
			['/repo/README.md', '/repo/eslint.config.mjs', '/repo/packages/ui/package.json'],
			root
		);

		assert.deepEqual(commands, [
			'eslint --no-warn-ignored --max-warnings 0 "/repo/eslint.config.mjs"',
			'prettier --check --ignore-unknown "/repo/README.md" "/repo/eslint.config.mjs"',
			'pnpm --filter ./packages/ui exec prettier --check --ignore-unknown "/repo/packages/ui/package.json"',
		]);
	});

	it('passes absolute paths, because pnpm exec runs inside the package', () => {
		const [eslint] = buildCommands(['/repo/packages/ui/src/components/button.tsx'], root);

		assert.match(eslint, / "\/repo\/packages\/ui\/src\/components\/button.tsx"$/);
	});
});
