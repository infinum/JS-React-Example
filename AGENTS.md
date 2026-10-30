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

# Feedback loop

Every check has one command, and the hooks run them for you at the right moment. All of them are in `scripts/verify.sh`.

| Signal                                    | Command                                     | Edit |   Stop   | pre-commit | pre-push | CI  |
| ----------------------------------------- | ------------------------------------------- | :--: | :------: | :--------: | :------: | :-: |
| Formatting                                | `pnpm prettier:check`                       |  ✅  |    ✅    |     ✅     |    ✅    | ✅  |
| Lint (type-aware, a11y, imports)          | `pnpm lint`                                 |  ✅  |    ✅    |     ✅     |    ✅    | ✅  |
| Types                                     | `pnpm typecheck`                            |      |    ✅    |            |    ✅    | ✅  |
| Unit, integration, component, story tests | `pnpm test`                                 |      |    ✅    |            |    ✅    | ✅  |
| Builds                                    | `pnpm build`                                |      |          |            |    ✅    | ✅  |
| Unused files, exports, dependencies       | `pnpm knip`                                 |      |    ✅    |            |    ✅    | ✅  |
| Licenses                                  | `pnpm check-licenses`                       |      | lockfile |            | lockfile | ✅  |
| Vulnerabilities                           | `pnpm audit --audit-level=high`             |      | lockfile |            | lockfile | ✅  |
| Changesets                                | `pnpm changeset status --since=origin/main` |      |          |            |    ✅    | ✅  |
| Coverage thresholds                       | `pnpm test:coverage`                        |      |          |            |          | ✅  |

"lockfile" means only when `pnpm-lock.yaml` changed. The Stop hook and pre-push check the packages changed since the branch split from `origin/main`.

- Before you call larger work done, run `pnpm verify`. It runs every check on every package.
- After you change logic, run `pnpm test:coverage:changed` and add tests for the new code it shows as uncovered.
- Lint warnings fail like errors. Disable a rule for a line only with a comment that says why.
- When you change a package under `apps/` or `packages/`, add a changeset (`.changeset/*.md`).
- Never lower a coverage threshold or add an audit exception to make a check pass. Report it instead.
- To read a failed CI run, use `gh run view <run-id> --log-failed`.

# Hooks

`.claude/settings.json` runs these checks for you:

- After every edit: Prettier on the edited file, Markdown included, then ESLint `--fix --max-warnings 0` on JS and TS files. Lint errors and warnings come back to you. Fix them before moving on.
- When you stop: `scripts/verify.sh agent` (the Stop column above). If it fails, you are asked to continue. Fix the failures instead of stopping again.
- Commands that update visual baselines are blocked.

Local URLs: frontend `http://localhost:3000`, Storybook `http://localhost:6006`.
