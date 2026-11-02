---
'@infinum/configs': minor
---

Turn on type-aware correctness rules: `@infinum/configs/eslint/typescript` now extends typescript-eslint's `recommendedTypeChecked` (`no-floating-promises`, `no-misused-promises`, `no-unsafe-*`...) and applies the ESLint recommended rules to TypeScript files too. `@infinum/configs/eslint/react` adds the `jsx-a11y` recommended rules. The new `@infinum/configs/eslint/import` export checks for import cycles, self-imports, duplicate imports and imports of packages the importing package doesn't declare. The deprecated `no-return-await` rule is removed.

`createTestConfig` gets an `integration` option that adds a Node.js `integration` project for `*.integration.test.ts` files next to the `unit` project, and a `node` environment. With `COVERAGE_CHANGED=<git ref>`, coverage only measures the files changed since that ref.
