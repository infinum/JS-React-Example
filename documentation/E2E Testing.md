# E2E Testing (Playwright)

## How to run

- All E2E (root script): `pnpm e2e`
  - Headed: `pnpm e2e -- --headed`
  - UI runner: `pnpm e2e -- --ui`
  - Debug/inspector: `pnpm e2e -- --debug`
- Update visual baselines: `pnpm e2e:update`
- Install browsers (once per machine/CI image): `pnpm e2e:install`
- Show last HTML report (if generated): `pnpm e2e:report`

All commands can be run only for a specific package with Turbo filtering, for example `pnpm e2e --filter *frontend* -- --ui`.

## What gets produced (gitignored)

- `playwright-report/` — HTML report output when using `--reporter=html` or `show-report`.
- `reports/` — project-owned artifacts: visual baselines under `reports/screenshots/`, a11y reports under `reports/a11y/`.
- `test-results/` — per-run output (actual/expected screenshots, traces, error context); safe to delete.
  Snapshots stored in `*.spec.ts-snapshots/` stay committed as baselines.

## Monorepo layout

- Tests: `apps/frontend-e2e/tests`
- Page objects: `apps/frontend-e2e/pages`
- Shared config: `@infinum/configs/playwright/base`
- Shared helpers: `@infinum/e2e-utils`

## Adding E2E for a new app

- Create a sibling E2E app `apps/<app>-e2e` for each new app.
- Register it in `packages/configs/src/playwright-config/apps.js` (name, dir, pnpm filter, port). The package config reads its port from there with `getE2eApp('<app>')`, and the root `playwright.config.ts` picks it up as a project for the Playwright agents.
- Add a `tests/seed.spec.ts` with the app's setup (login, locale) and exclude it with `testIgnore: '**/seed.spec.ts'` in the package config.
- Point `playwright.config.ts` to the shared base: `@infinum/configs/playwright/base`.
- Reuse helpers from `@infinum/e2e-utils` (fixtures, waits, viewports, reports).
- Keep snapshots and app-specific page objects inside that E2E app.
- Give each new Next app a unique prod port when running `next start` (e.g. `-p 3001`) so it doesn’t clash with existing frontend apps.
- Add `E2E_BASE_URL` for the new `apps/<app>-e2e` package, ideally inline before the command in `package.json`, e.g. `"e2e": "E2E_BASE_URL=http://localhost:3001 playwright test --reporter=html",`

## Consistency tips

- Generate and validate snapshots in headless for stable rendering; if you must use headed, regenerate and stay consistent.
- Ensure `E2E_BASE_URL` is set when not using `http://localhost:3000`.

## Playwright agents

The root `playwright.config.ts` combines every E2E app as a project. It's used only by the `playwright-test` MCP server (`.mcp.json`) and the Playwright agents. CI and `pnpm e2e` keep using each package's own config.

The Playwright skills and agents are generated from the installed `@playwright/test` version on every `pnpm install` (`scripts/install-playwright-harness.sh`) and are gitignored. Skills go to `.agents/skills/` with symlinks in `.claude/skills/` (same as the `skills` CLI), agents to `.claude/agents/`. After a Playwright upgrade they update on the next install. Rerun manually with `pnpm skills:playwright`.

## Testing with Act

Run locally with [GitHub Act](https://github.com/nektos/act) from the repo root; ensure the apps default ports are free before starting.

```sh
act pull_request -W ./.github/workflows/e2e.yml -j e2e
```
