# Next.js docs

Next.js is installed per app, not at the root. Before any Next.js work, read the version-matched docs in the app's own `node_modules`:

- `apps/frontend/node_modules/next/dist/docs/`

Your training data is outdated — these docs are the source of truth.

# Browser and E2E tools

- **Playwright Test** is the feedback loop. A change is done when the relevant suite passes. Add or update a test for every regression you find.
- **Playwright agents** (`playwright-test-planner`, `-generator`, `-healer`) plan, write, and fix E2E tests through the `playwright-test` MCP server, which runs the root `playwright.config.ts` with one project per E2E app. Pass the app's project name (e.g. `frontend`) to the Playwright tools.
- **`playwright-cli` skill** is for exploring the UI before a test exists. Run it as `pnpm exec playwright cli`, never a global install.
- **`playwright-trace` skill** is for reading traces of failed tests (`apps/<app>-e2e/test-results/`).
- **chrome-devtools MCP** is only for performance traces, Lighthouse, and memory debugging.

Never update visual baselines (`--update-snapshots`) to make a failing test pass. Report the diff instead, a human approves baseline changes.

# Hooks

`.claude/settings.json` runs these checks for you:

- After every edit: Prettier and ESLint `--fix` on the edited file, or remark for Markdown. Lint errors come back to you. Fix them before moving on.
- When you stop: `pnpm turbo run lint typecheck test --affected`. If it fails, you are asked to continue. Fix the failures instead of stopping again.
- Commands that update visual baselines are blocked.

Local URLs: frontend `http://localhost:3000`, Storybook `http://localhost:6006`.
