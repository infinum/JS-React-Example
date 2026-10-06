# Frontend E2E

- Tests go in `apps/frontend-e2e/tests/` as `<feature>.e2e.spec.ts`, page objects in `apps/frontend-e2e/pages/`.
- Test plans from the planner go in `apps/frontend-e2e/specs/`.
- `tests/seed.spec.ts` logs in and leaves the page on `/en`. The Playwright agents start every session from it, and it's excluded from `pnpm e2e`.
- Reuse helpers from `@infinum/e2e-utils` before writing new ones.
