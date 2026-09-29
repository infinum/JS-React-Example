# PRD: Migrate from Jest to Vitest

## 1. Introduction / Overview

Unit and component tests in this monorepo run on **Jest** today. We want to replace Jest with **Vitest** in every workspace that has tests, and move **Storybook** to the Vite-based Next.js framework so that stories run as tests too.

### Why we are doing this

The long-term goal is **loop engineering**. An AI agent (Claude Code, driven by hooks) should be able to change code and then check the result by itself: "is it done?" (completion signal) and "did I break something?" (regression signal). For that, we need:

1. **Story tests.** Every Storybook story is checked automatically for render errors, broken interactions and accessibility violations.
2. **Visual regression tests.** Screenshots of stories are compared against approved baselines. This is a **follow-up project**, but this migration must prepare for it.
3. **One test runner.** Story tests and visual tests need Vitest, so the Next.js frontend and the UI package move to Vitest as well. The project then has a single testing solution, and agents only need to learn one set of commands, one output format and one config style.

### Current state (for context)

| Workspace          | What exists today                                                                                                                                                                                                                                                                                                                                                   |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `apps/frontend`    | Jest config built on `next/jest`. There is a setup file (`src/tests/jest.setup.tsx`) that mocks `next/router`, `next/link` and `next-intl/server`, plus shared render helpers (`src/tests/utils.tsx`, including `renderServer`). There are 4 test files, and one of them tests an `async` Server Component (`HomePage`). Tests access mocks through `require(...)`. |
| `packages/ui`      | Jest config with `ts-jest`. There is a setup file (`src/tests/jest.setup.ts`) that fakes `matchMedia`, `ResizeObserver` and `IntersectionObserver`. There are 6 test files: 5 components (built on Radix) and the `cn` util.                                                                                                                                        |
| `apps/storybook`   | Storybook 10 runs on the webpack-based `@storybook/nextjs` framework. It has no story tests and no `play` functions yet.                                                                                                                                                                                                                                            |
| `packages/configs` | Shared Jest base config (`src/jest-config`) with coverage thresholds and reporters, and a shared ESLint config for Jest (`src/eslint-config/jest.mjs`).                                                                                                                                                                                                             |
| Root / CI          | Turbo scripts `test`, `test:watch`, `test:coverage` and `test:coverage:watch`. `pre-push` runs `test:coverage`. The `coverage.yml` workflow runs the tests, aggregates per-package coverage from `coverage/<pkg>` with `scripts/aggregate-coverage-results.js`, and comments the coverage diff on PRs. Playwright is already installed for E2E.                     |

### Problem

- Jest needs a separate TypeScript/ESM transform pipeline (`ts-jest`, `next/jest`, `transformIgnorePatterns` workarounds for `next-intl`). This pipeline is different from the one the apps build with, it is slow, and it breaks easily when dependencies update.
- Storybook uses webpack, and nothing checks stories automatically. A broken story or an accessibility regression is only noticed when someone opens Storybook by hand, and an agent never notices it.
- The current setup can't do visual regression testing, and it gives no reliable, machine-readable signal that an agent could act on.

### Goal

Use Vitest as the single test runner. It should run in the right environment for each kind of test, migrate every existing test with its intent unchanged, run all Storybook stories as tests (including accessibility checks) in a real browser, remove Jest completely, and produce clear pass/fail signals that humans, CI and agent hooks can all use.

Reference docs:

- Next.js + Vitest: <https://nextjs.org/docs/app/guides/testing/vitest>. A version-matched copy is at `apps/frontend/node_modules/next/dist/docs/01-app/02-guides/testing/vitest.md`, and that copy is the source of truth.
- Storybook Next.js (Vite) framework: <https://storybook.js.org/docs/get-started/frameworks/nextjs-vite>
- Storybook Vitest addon: <https://storybook.js.org/docs/writing-tests/integrations/vitest-addon>

## 2. Goals

1. Every existing unit and component test in `apps/frontend` and `packages/ui` runs on Vitest and passes. No test is deleted or skipped to make the migration pass.
2. Nothing Jest-related is left in the repository: no Jest dependencies, configs, setup files, type references, ESLint rules or documentation mentions.
3. Storybook runs on the Vite-based Next.js framework, and every story runs as a test (render, `play` function and accessibility check) in a real browser.
4. Accessibility violations in stories **fail** the test run.
5. The root commands (`pnpm test`, `pnpm test:watch`, `pnpm test:coverage`, `pnpm test:coverage:watch`) keep the same names and behavior.
6. Coverage reports keep going to `coverage/<pkg>`, in a format the existing aggregation script and CI coverage comment can read. The thresholds are at least as strict as today's.
7. Test results are **agent-consumable**: exit codes are reliable, machine-readable output is available, it is possible to run only the tests affected by a change, and the results are deterministic (no flaky tests).
8. The browser test setup can be extended with visual regression (screenshot) tests later, without switching tools or restructuring.

## 3. Key Decisions

These decisions were made while writing this PRD. Each one includes the reasoning, so that reviewers can challenge it.

### 3.1 Two test environments, each used where it gives the most reliable signal

| Environment                                | What it is                                                                                                                                                                                                                                                              | Used for                                                                                          |
| ------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| **Simulated DOM (jsdom)** in Node.js       | A JavaScript imitation of a browser DOM. It is very fast and makes module mocking easy. It has **no** layout, CSS, real focus or pointer events, `matchMedia` or observers, so those must be faked.                                                                     | `apps/frontend` tests, and pure logic tests anywhere (for example `cn`).                          |
| **Real browser (Chromium via Playwright)** | Tests run inside a real headless browser (Vitest "browser mode"). Rendering, CSS, focus, pointer events and browser APIs are real. It starts more slowly (seconds, not milliseconds), and it's the only environment where screenshots (visual regression) are possible. | `packages/ui` component tests, all Storybook story tests, and the future visual regression tests. |

**Why jsdom and not happy-dom for the simulated DOM:** jsdom is the default in the Next.js docs, it follows web standards more closely, and it's what we use today. That means fewer behavior changes during the migration. happy-dom is faster, but its gaps (events, some DOM APIs) can make tests pass or fail for the wrong reasons. A false signal is the worst possible outcome in an agent feedback loop. With only about 10 test files, the speed difference doesn't matter.

**Why `packages/ui` component tests move to a real browser:**

- The UI package is a pure client-side component library. It has no Next.js or server dependencies, so it runs in a browser cleanly.
- Its components are built on Radix, which depends on real pointer events, focus management and layout. In jsdom these have to be faked (the current setup already fakes `matchMedia`, `ResizeObserver` and `IntersectionObserver`). Fakes can hide real bugs, which again gives agents false signals.
- Story tests and the future visual tests run in the browser anyway. Component tests, story tests and screenshots then share one environment, one setup and one set of rules.

**Why `apps/frontend` stays in jsdom:** its tests depend on mocking server-only modules (`@/lib/auth`, `next-intl/server`, `next/image`) and on calling `async` Server Components (see 3.4). Neither of these fits a real browser. Real-browser behavior of the frontend is already covered by the Playwright E2E suite.

**For hooks:** the fast jsdom tests are suitable for running after every edit. The browser tests are suitable for "task complete" checks, pre-push and CI. Both support running only the tests related to changed files.

### 3.2 Accessibility violations fail tests

For a feedback loop, a warning doesn't work as a signal. Agents and CI only react to failures. The global setting is therefore **fail on violation**. A single story can opt out only through an explicit parameter with a written reason in the code, for example a known upstream Radix issue. That opt-out shows up in review.

### 3.3 Story test coverage is reported separately

Story test coverage is written to `coverage/storybook` and shown as a **separate entry** in the CI summary and the PR comment. It is **not** merged into `ui` coverage. Keeping it separate shows which kind of test covers which code, and it avoids extra merge tooling. It has no threshold at first (report only). Once there is a baseline, a threshold can be added.

### 3.4 `async` Server Components (the `HomePage` test)

**Background:** React (and so React Testing Library) can't render an `async` component through `render(<HomePage />)` in a test DOM. That's why the Next.js docs recommend E2E tests for async Server Components. This is a React limitation and has nothing to do with Jest or Vitest, so the switch doesn't make it worse.

**What the existing test does:** it doesn't render `<HomePage />` through React. It calls `await HomePage()` as a normal async function, which returns plain JSX, and then renders that JSX. The `renderServer` helper in `src/tests/utils.tsx` does the same. This works identically in Vitest.

**Where this pattern stops working:**

- An async component that renders **other async** Server Components as children. Those children are not awaited and won't render.
- Real request APIs (`cookies()`, `headers()`), `server-only` imports, Suspense and streaming, and Server Actions all need a real Next.js server.
- Real authentication and data flows.

**Decision:** keep the `HomePage` test and the `renderServer` helper. The rule for new tests is: use `renderServer` for an async Server Component whose data dependencies can all be mocked and whose children are not async. Test everything else with E2E (Playwright). This rule must be written down in the testing documentation.

### 3.5 Test APIs are imported explicitly (no globals)

Test files import `describe`, `it`, `expect` and `vi` from `vitest` explicitly. This is Vitest's default and current industry practice. The reasons:

- It avoids type clashes between different global `expect` definitions (this repo also uses Playwright, which has its own `expect`).
- It makes it obvious which runner a file belongs to, for both people and agents.
- It's the approach Vitest recommends.

Every test file has to be touched anyway (to replace `jest.mock`), so this adds almost no extra work. DOM matchers such as `toBeInTheDocument` stay registered globally through the setup file.

## 4. User Stories

- **As a developer**, I want to run `pnpm test` from the root and have all unit, component and story tests run, so that I get one pass/fail signal for the whole repo.
- **As a developer**, I want to run the tests of a single package in watch mode with fast re-runs, so that I get quick feedback while I code.
- **As a developer**, I want tests to resolve `@/…` and `@infinum/ui/…` imports the same way the app does, so that I don't have to keep a separate list of module aliases.
- **As a developer writing a new test**, I want DOM matchers, common Next.js mocks and the right environment to be set up already, so that I only write the test itself.
- **As a UI component author**, I want every story I write to be tested automatically for render errors, interaction failures and accessibility violations, so that regressions are caught before review.
- **As a UI component author**, I want to run story tests from the Storybook UI and from the command line, so that I can debug a failing story visually.
- **As an AI agent working through hooks**, I want to run only the tests affected by my change and get a clear, machine-readable pass/fail result with the failure details, so that I can decide by myself whether my task is done or whether I broke something.
- **As a reviewer**, I want the PR coverage comment to keep working, with story coverage shown separately, so that I can see how a change affects coverage.
- **As a new team member**, I want the documentation to describe the Vitest setup, including when to use unit, browser, story and E2E tests, so that I know which kind of test to write.

## 5. Functional Requirements

### 5.1 Shared configuration (`packages/configs`)

1. `@infinum/configs` must provide a shared, reusable Vitest base configuration that replaces the current `jest-config`. It must include:
   - which files count as tests: `**/__tests__/**` and `**/*.{test,spec}.{ts,tsx,js}`. E2E `*.e2e.spec.ts` files must be excluded.
   - the coverage include and exclude rules (the same as today: `src/**/*.{ts,tsx}`, without `.d.ts`, test files, stories and `__tests__`)
   - the coverage reporters, which must include `json-summary`, `lcov`, `text` and `html`
   - default coverage thresholds that are not lower than the current ones (7% for branches, functions, lines and statements)
2. The shared config must provide reusable presets for both environments: the **simulated DOM (jsdom)** and the **real browser (Chromium)**. A package must be able to pick one, or both for different sets of files, without copying settings.
3. Each package must be able to extend the shared config and override only the values specific to it, such as the coverage directory, setup files and aliases.
4. The shared ESLint config for Jest must be replaced with an equivalent config for Vitest that applies to the same test file patterns. It must include a rule that stops focused tests (`.only`) from being committed.
5. The shared `jest-config` folder and its README must be removed. They must be replaced by a Vitest config with its own README that explains how to extend it and when to use each environment.

### 5.2 Frontend app (`apps/frontend`) — simulated DOM (jsdom)

6. Tests must run in jsdom with React Testing Library, `@testing-library/user-event` and the `jest-dom` matchers. The matchers must be registered globally in the setup file.
7. Path aliases (`@/…` and `@infinum/ui/…`) must resolve in tests the same way they resolve in the app. The alias list must not be copied by hand into a test config.
8. The global mocks from the current setup file (`next/router`, `next/link`, `next-intl/server`) must behave the same way under Vitest.
9. The shared render helpers in `src/tests/utils.tsx` (`render` with providers, and `renderServer`) must keep working, and tests must keep importing them from `@/tests/utils`.
10. All 4 existing test files must be migrated so that they assert the same things as before. This includes `HomePage.test.tsx` (see 3.4). Places where tests access mocks through `require(...)` must be replaced with the ESM-compatible way that Vitest supports.
11. CSS and other asset imports must not break tests.
12. Coverage output must go to `coverage/frontend`.

### 5.3 UI package (`packages/ui`) — real browser

13. Component tests must run in a real headless Chromium browser (see 3.1), with React Testing Library, `user-event` and the `jest-dom` matchers available.
14. The fake `matchMedia`, `ResizeObserver` and `IntersectionObserver` implementations must be removed, because the browser provides the real APIs. They may only stay if a specific test needs to control a value, for example forcing a media query. That test then sets it up locally.
15. Pure logic tests with no DOM, such as `cn`, may run in either environment. Pick whichever is simpler, as long as they are still part of the package's `test` command.
16. All 6 existing test files must be migrated so that they assert the same things as before.
17. The `test` script must still pass when a package has no test files (today this is done with `--passWithNoTests`).
18. Coverage output must go to `coverage/ui`.

### 5.4 Storybook (`apps/storybook`) — real browser

19. Storybook must be moved from the webpack-based `@storybook/nextjs` framework to the Vite-based Next.js framework. All existing addons (themes, docs, a11y, designs, MCP) must keep working.
20. `pnpm dev` and `pnpm build` for Storybook must work, and all existing stories (including stories loaded from `packages/ui`) must render the same way as before, including Tailwind styles and theme switching.
21. Every story must run as an automated test in a real headless browser. A story test fails if:
    - the story throws while rendering,
    - its `play` function fails (when it has one), or
    - the a11y addon reports **any** accessibility violation (see 3.2).
22. A story may opt out of the a11y check only through an explicit story parameter with a code comment that explains why. It must be documented how to do this.
23. Story tests must be runnable in three ways:
    - from the command line, through the Storybook workspace's `test` script, so that the root `pnpm test` includes them
    - in watch mode, through `test:watch`
    - from the Storybook UI (the testing widget)
24. Story tests must run headless in CI and in the `pre-push` hook. Pre-push runs only the affected tests (see requirement 35).
25. Story test coverage must be written to `coverage/storybook` and appear as a separate entry in the aggregated summary. There is no threshold at first (see 3.3).
26. Webpack-only Storybook dependencies must be removed, for example `@storybook/nextjs` from both `apps/storybook` and `packages/ui`.

### 5.5 Feedback-loop readiness (agent signals)

27. Every test command must exit with a non-zero code when **any** test fails, including a11y failures, and with zero only when everything passed.
28. Every package must be able to run **only the tests related to a given set of changed files**, both through Vitest's own options and through a documented command. Hooks can then give fast feedback on each change.
29. Every package must be able to output results in a **machine-readable format** (for example JSON or JUnit) to a known location when asked, without changing the default human-readable output.
30. Test output on failure must include the test name, file path and assertion message, and must not be flooded with unrelated noise (for example, expected console errors must be silenced as they are today).
31. Tests must be deterministic. The full suite must pass **3 times in a row** locally and in CI with no flaky failures.
32. The browser environment must use fixed, documented settings (browser engine, viewport size, headless mode), so that results, and later screenshots, are the same on every machine.

### 5.6 Monorepo, CI and cleanup

33. The root scripts `test`, `test:watch`, `test:coverage`, `test:coverage:watch` and `test:coverage:aggregate` must keep their names and behavior, and must include every workspace that has tests (frontend, ui, storybook).
34. `scripts/aggregate-coverage-results.js` must produce the same GitHub job summary and the same combined `coverage-summary.json` as before, now also including the `storybook` entry. Comments that mention Jest must be updated.
35. **Pre-push runs only affected tests.** The `pre-push` hook must run only the tests related to the files changed since the branch split from `main`, across all workspaces, including story tests. It must still fail on any failing or a11y-violating test. CI always runs the **full** suite. If the set of affected tests can't be determined reliably (for example, the shared test config or setup files changed), pre-push must fall back to running the full suite.
36. **Caching wherever possible, locally and in CI:**
    - Turbo task caching must work for the test tasks. The task inputs must cover the source, test, story and config files, and the outputs must include the coverage directories. Re-running tests on unchanged packages must be a cache hit.
    - In CI, the Chromium browser used by the browser tests must be cached between runs, and shared with the E2E Playwright install where possible.
    - Caching must never hide a real failure. A change to any test, source, story or config file must invalidate the cache for the affected package.
37. The `coverage.yml` workflow must pass and must keep posting the coverage diff comment on PRs. It must install the Chromium browser that the browser tests need, using the cache from requirement 36.
38. All Jest-related packages must be removed from the workspace `package.json` files and from the pnpm catalog. This includes `jest`, `jest-environment-jsdom`, `ts-jest`, `@types/jest` and `eslint-plugin-jest`. Also remove `ts-node` if it was only used for the Jest config.
39. All Jest config and setup files must be removed or renamed, for example `jest.config.*` and `jest.setup.*`. No `jest.*` global may be used anywhere in the codebase.
40. TypeScript must type-check test files with Vitest types and the `jest-dom` matcher types, and `pnpm typecheck` must pass.
41. `pnpm lint`, `pnpm prettier:check` and `pnpm check-licenses` must pass. Any new dependency must pass the license check.
42. The documentation must be updated:
    - `README.md`: the "Testing" lines. Replace the incorrect "Jest-axe integration" claim with the Storybook a11y story tests.
    - `documentation/Development Workflow Guide.md`, `documentation/Monorepo Structure.md` and `documentation/UI Components Guide.md`.
    - The shared configs README.
    - A short "Which test should I write?" guide covering unit (jsdom), component (browser), story, E2E and the `async` Server Component rule from 3.4. It must also explain that pre-push runs only affected tests while CI runs everything.
43. A changeset must be added for every affected package.

## 6. Non-Goals (Out of Scope)

- **Visual regression tests.** This is a separate follow-up PRD. This migration only has to make them possible (requirement 32, and Goal 8).
- **Claude Code hooks themselves.** Writing and configuring the hooks is a follow-up. This migration only has to provide the signals the hooks will use (section 5.5).
- Writing new unit tests or raising coverage beyond today's level. The only exception is the story tests that come from existing stories.
- Changing the Playwright E2E setup (`apps/frontend-e2e`, `packages/e2e-utils`).
- Adding `play` functions or interaction tests to existing stories, beyond what is needed to make them pass.
- Running `apps/frontend` tests in a real browser.
- Rewriting UI tests to browser-specific testing APIs (locators with auto-retry). Tests keep the React Testing Library style, and moving to those APIs can be considered later.
- Redesigning the test folder structure or the naming conventions.

## 7. Design Considerations

- The developer experience must stay familiar. The same commands and the same test file locations are used, and the test APIs are almost the same. The only visible change is the explicit `vitest` imports.
- The Storybook testing widget (the Vitest addon UI) must be visible and usable in the Storybook sidebar during local development.

## 8. Constraints & Dependencies

- Next.js is installed per app. The version-matched docs in `apps/frontend/node_modules/next/dist/docs/` are the source of truth, not general online knowledge (see `AGENTS.md`).
- The browser tests need a Chromium browser, locally and in CI. The repo already uses Playwright for E2E, and that installation should be reused. First-time local setup (browser install) must be documented, or handled by the existing bootstrap script.
- Browser tests are slower to start than jsdom tests. The combined `pnpm test:coverage` time in CI must stay acceptable (see Success Metrics).
- Versions must be managed through the pnpm catalog (`pnpm-workspace.yaml`), the same as all other dependencies.
- Node 24 and pnpm 11 (from `package.json` engines) must be supported.
- The migration must be delivered as one complete change set. Jest and Vitest must never exist side by side on `main`.

## 9. Success Metrics

- 100% of the existing unit and component test files (10 files) pass on Vitest, and each one has the same number of test cases as before.
- 100% of the existing stories pass as story tests (render and a11y), both in CI and locally.
- The full suite passes 3 runs in a row with no flaky failures.
- A deliberately introduced a11y violation in a story makes `pnpm test` exit with a non-zero code. Verify this once and describe it in the PR.
- Running only the tests related to one changed UI component file finishes in under 15 seconds locally.
- `grep -ri jest` finds nothing, apart from the `jest-dom` matcher package name and CHANGELOG history.
- The PR coverage comment works on the migration PR, and coverage per package is within ±1% of the Jest baseline. The `storybook` entry appears separately.
- The `pnpm test:coverage` wall-clock time in CI, including story tests, is recorded in the PR description next to the Jest baseline. It must not be more than 2× the Jest baseline. (Agreed: the story tests are new checks, not just a runner swap, so some growth is expected.)
- A second CI run with no code changes shows the test tasks restored from cache, and the Chromium browser restored from the CI cache instead of downloaded again.
- A push that changes only one UI component runs only the tests related to it in `pre-push`. A push that changes the shared test config runs the full suite.
- `pnpm lint`, `pnpm typecheck`, `pnpm prettier:check`, `pnpm check-licenses` and `pnpm build` all pass.

## 10. Open Questions

None at this time. Resolved decisions are recorded in section 3 and in requirements 35–36 (pre-push scope, caching) and the Success Metrics (CI time budget).
