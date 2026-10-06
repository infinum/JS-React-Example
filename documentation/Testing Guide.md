# Testing Guide

## TL;DR

- Unit, component and story tests run on **Vitest**. End-to-end tests run on **Playwright** ([E2E Testing](E2E%20Testing.md)).
- `pnpm test` runs every unit, component and story test in the repo. It exits with a non-zero code if any test fails, including an accessibility violation in a story.
- `pre-push` runs only the tests affected by your branch. CI always runs the full suite.

## Which test should I write?

| You are testing…                                                                                  | Write                    | Runs in                          | Where                                     |
| ------------------------------------------------------------------------------------------------- | ------------------------ | -------------------------------- | ----------------------------------------- |
| Logic with no DOM (utils, formatting, i18n helpers)                                               | Unit test                | the package's environment        | `__tests__/*.test.ts` next to the code    |
| An `apps/frontend` component, including code that uses server-only modules                        | Unit test (jsdom)        | Node.js with a simulated DOM     | `*.test.tsx` next to the component        |
| A `packages/ui` component: behavior, props, events                                                | Component test (browser) | Headless Chromium                | `packages/ui/src/components/__tests__/`   |
| What a `packages/ui` component looks like in its variants, and its accessibility                  | Story                    | Headless Chromium                | `packages/ui/src/components/__stories__/` |
| A page, a user flow, routing, auth, real data, or an `async` Server Component with async children | E2E test                 | Real Next.js server + Playwright | `apps/frontend-e2e/`                      |

### Unit tests (jsdom) — `apps/frontend`

jsdom is a JavaScript imitation of a browser DOM. It is fast and module mocking is easy, but it has no layout, CSS, real focus or pointer events. The setup file (`src/tests/vitest.setup.tsx`) registers the `jest-dom` matchers and mocks `next/link` and `next-intl/server`. Render components with the helpers from `@/tests/utils`, which wrap them in the app's providers.

### `async` Server Components

React can't render an `async` component with `render(<Page />)`. Call it as a function and render the JSX it returns. `renderServer` from `@/tests/utils` does this for you:

```tsx
const { getByText } = await renderServer(TestComponent, { description: 'Hello' });
```

Use `renderServer` only when **all** of these are true:

- every data dependency of the component can be mocked (for example `getTranslations`, `getServerSession`),
- none of its children are `async` Server Components (they would not be awaited), and
- it doesn't need real request APIs (`cookies()`, `headers()`), `server-only` imports, Suspense and streaming, or Server Actions.

Test everything else with an E2E test.

### Component tests (browser) — `packages/ui`

The UI components are built on Radix, which relies on real pointer events, focus and layout. Their tests run in headless Chromium through Vitest browser mode, so they get the real browser APIs instead of fakes. Write them with React Testing Library and `user-event`, the same as jsdom tests.

### Story tests — `apps/storybook`

Every story is also a test. `@storybook/addon-vitest` renders each story in headless Chromium and fails when:

- the story throws while rendering,
- its `play` function fails, or
- the a11y addon finds **any** accessibility violation.

Writing a story is enough to get these checks. Add a `play` function when you want to test an interaction. See [UI Components Guide](UI%20Components%20Guide.md#storybook-stories-are-tests) for how to opt a single story out of the a11y check.

## Writing tests

Import the test APIs from `vitest` in every test file. There are no globals.

```ts
import { describe, expect, it, vi } from 'vitest';
```

| Instead of (Jest)                      | Use (Vitest)                                     |
| -------------------------------------- | ------------------------------------------------ |
| `jest.fn()`, `jest.spyOn()`            | `vi.fn()`, `vi.spyOn()`                          |
| `jest.mock(path, factory)`             | `vi.mock(path, factory)`                         |
| `require('mod').fn as jest.Mocked…`    | `import { fn } from 'mod'`, then `vi.mocked(fn)` |
| a variable used in a `vi.mock` factory | wrap it in `vi.hoisted(() => …)`                 |

Mocks, stubbed globals and stubbed env variables are reset between tests. ESLint fails on committed `.only` tests.

## Commands

| Command                                                       | What it does                                                                 |
| ------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| `pnpm test`                                                   | All tests in all packages                                                    |
| `pnpm test:watch`                                             | Watch mode                                                                   |
| `pnpm test:coverage`                                          | All tests with coverage, written to `coverage/<package>`                     |
| `pnpm test:affected`                                          | Only the tests affected by changes since the branch split from `origin/main` |
| `pnpm --filter @infinum/ui test`                              | One package                                                                  |
| `pnpm --filter @infinum/ui exec vitest related <file…> --run` | Only the tests related to specific files                                     |
| `TEST_REPORT=true pnpm test`                                  | Also writes `test-results/<package>/results.json` and `junit.xml`            |

Story tests can also run from the Storybook UI: open Storybook (`pnpm --filter @infinum/storybook dev`) and click **Run tests** at the bottom of the sidebar.

### First-time setup

Browser tests need Chromium. `pnpm install` installs it through `scripts/install-test-browsers.sh`. To install it by hand:

```bash
pnpm --filter @infinum/ui exec playwright install chromium
```

It's the same Playwright version as the E2E tests, so the browser download is shared.

## Pre-push and CI

- **pre-push** runs `pnpm test:affected`. Turbo picks the packages that changed (and the packages that depend on them), and Vitest runs only the tests related to the changed files. If the shared test setup changed (the shared Vitest config, a setup file, `.storybook/`, a `tsconfig`) or there's no `origin/main` to compare with, it runs the full suite instead. Pre-push doesn't collect coverage.
- **CI** (`coverage.yml`) always runs the full suite with `pnpm test:coverage` and posts the coverage diff on the pull request. `storybook` is a separate entry in that comment and has no threshold yet.

Turbo caches test results. A package's tests re-run when any of its source, test, story or config files change, and when `packages/ui/src` changes for `frontend` and `storybook`.

## Configuration

All packages extend the shared config in `@infinum/configs/vitest`. See its [README](../packages/configs/src/vitest-config/README.md) for the options.
