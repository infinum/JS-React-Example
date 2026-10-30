---
'@infinum/configs': minor
---

Replace the shared Jest config with a shared Vitest config (`@infinum/configs/vitest`) that has `jsdom` and `browser` (Chromium) presets, and replace `@infinum/configs/eslint/jest` with `@infinum/configs/eslint/vitest`. The `./jest` and `./eslint/jest` exports are removed.
