---
'@infinum/frontend': minor
---

Upgrade Next.js to 16.4.2, which fixes critical remote code execution advisories (GHSA-p293-qw3h-jr36, GHSA-2xp9-vwfh-vxw4, GHSA-vcvr-r3jv-pc5j, GHSA-2464-fhr4-w9xw, GHSA-673q-mjm6-r5xr) among others. Add integration tests for the proxy, the auth options, env validation and the i18n request config, including a check that every locale has the same translation keys. The login form no longer passes a promise-returning handler to `onSubmit`, `server-only` is declared as a dependency, and the unused `src/scripts/load-env-config.ts` is removed.
