---
'@infinum/ui': minor
---

Run component tests on Vitest in headless Chromium instead of Jest with jsdom. The default theme's `--color-destructive` is now rose-600 instead of rose-500, so white text on destructive buttons meets the WCAG AA contrast ratio. The dark and rainbow theme files now put `@import` before `@custom-variant`, which Vite requires.
