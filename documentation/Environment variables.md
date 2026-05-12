# Environment Variables

> **TL;DR Cheat-Sheet**
>
> 1. **Committed templates** — `.env` and `.env.compose` are tracked in git with non-secret defaults.
> 2. **Developer overrides** — All `*.local` files are ignored and never committed. Use them for personal non-secret tweaks (ports, feature flags), not real secrets.
> 3. **Secrets** — Never written to disk. Injected at task-run time by [scripts/with-secrets.sh](../scripts/with-secrets.sh) from the configured secret-store CLI (1Password by default — see [Secrets](#secrets)).
> 4. **Two validators** — `validate-env.client.ts` for public vars, `validate-env.server.ts` for secrets.
> 5. **Type-safe access** — Use `getPublicEnv()` for public vars, `secretEnv()` for secrets.
> 6. Variables in `validate-env.client.ts` are exposed to the browser (no `NEXT_PUBLIC_` prefix needed).
> 7. Never put secrets in `validate-env.client.ts` - only in `validate-env.server.ts`.
>
> **!! WARNING !!**
>
> Variables in `validate-env.client.ts` are automatically exposed to the browser. Never put secrets there.
>
> If you try to use `secretEnv()` in a client component, it will throw a build error due to the `'server-only'` import.

## Overview

The monorepo uses a repeatable pattern for environment variables that works on the host machine, inside Docker containers, and in CI. Each app maintains committed template files with non-secret defaults; developers add personal non-secret overrides in local files that are never committed; and true secrets live outside the filesystem entirely, injected into the process environment at task-run time (see [Secrets](#secrets)).

### High-Level Goals

Each application has:

- **`.env`** — Committed, non-secret host defaults for running the app on your local machine.
- **`.env.compose`** — Committed, non-secret Docker defaults for running the app in containers.
- **`.env.secret`** — Committed, but contains only **references** (e.g. `op://vault/item/field`), not resolved values. Read at task-run time by [scripts/with-secrets.sh](../scripts/with-secrets.sh).
- **`*.local` files** — Developer-specific non-secret overrides, never committed to git.
- **Secrets** — Not in any committed file as values. Injected at task-run time by the wrapper script from a secret-store CLI (1Password by default) locally, and from the pipeline's secret provider (e.g. GitHub Actions secrets) in CI.

We use:

- **envsafe** for runtime validation of environment variables (fail-fast on missing/invalid values).
- **next-public-env** for accessing environment variables in a type-safe way, with separate client and server validators.
- Two validator files: `validate-env.client.ts` for public variables and `validate-env.server.ts` for server-only variables.

Key goals:

- **No "works on my machine" bugs** - host and container values are isolated.
- **No secret values in git** - templates carry non-secret defaults; `.env.secret` carries references that require vault auth to resolve.
- **No secrets on disk** - real secret values are fetched on demand and live only in the process environment that needs them.
- **Early failure** - missing or malformed variables abort the start-up sequence.
- **Type safety** - the `envsafe()` helper supplies autocomplete and correct types.

## Git & File Rules

The apps should use the following `.gitignore` rules for environment files:

```gitignore
# Environment variables
.env*
!.env
!.env.compose
!.env.secret
```

### What This Means

**Only `.env`, `.env.compose`, and `.env.secret` are tracked in git.**

All other `.env*` files are ignored, including:

- `.env.local`
- `.env.development.local`
- `.env.production.local`
- `.env.test.local`
- `.env.compose.local`
- `.env.secret.local` (if anyone uses `op inject` to materialize resolved values locally)

### Important Rules

1. **Never put secret values in any env file** — not in committed templates (`.env`, `.env.compose`) and not in gitignored `.local` files. `.env.secret` is tracked, but it must only contain *references* (e.g. `op://...`), never resolved values.
2. **Use `.local` files for non-secret developer overrides** — per-developer ports, feature flags, alternate URLs, etc. If a value is truly sensitive, it belongs in the secret store, not here.
3. **Templates are for defaults** — committed files should contain example values, localhost URLs, and other non-sensitive defaults. When a secret-bearing variable is handled by `.env.secret`, add a comment to `.env` (and `.env.compose` if applicable) pointing at this guide so contributors don't re-add it to the file.

## Next.js Environment File Reference

Each application uses multiple environment files with different purposes and precedence:

| File                          | Purpose                                                         | Tracked in Git? | Used Where |
| ----------------------------- | --------------------------------------------------------------- | --------------- | ---------- |
| `.env`                        | Host defaults (local dev on your machine)                       | **Yes**         | Host       |
| `.env.local`                  | Host-only non-secret overrides for this developer               | **No**          | Host       |
| `.env.development.local`      | Optional host-only non-secret overrides when `NODE_ENV=development` | **No**       | Host       |
| `.env.production.local`       | Optional host-only non-secret overrides when `NODE_ENV=production`  | **No**       | Host       |
| `.env.test.local`             | Optional host-only non-secret overrides when `NODE_ENV=test`        | **No**       | Host       |
| `.env.compose`                | Docker defaults (typically using service names)                 | **Yes**         | Docker     |
| `.env.compose.local`          | Docker-only non-secret overrides for this developer             | **No**          | Docker     |
| `.env.secret`                 | Provider **references** to secrets (e.g. `op://...`)            | **Yes**         | Host / Docker-via-host |

### Host vs Docker Usage

**Host (Running on Your Machine):**

When you run `next dev` or similar commands directly on your machine (not in Docker), Next.js reads `.env*` files in a specific order (see next section). Typically you'll use:

- `.env` for generic defaults
- `.env.local` to override non-secret values per developer
- `pnpm dev` (which invokes the wrapper) to inject secrets on top (see [Secrets](#secrets))

**Docker (Running in Containers):**

When you run via `docker-compose up`, the `env_file` entries in `docker-compose.yml` load variables directly into the container's `process.env`. These bypass the Next.js file loading and take highest precedence. Typically you'll use:

- `.env` for generic defaults
- `.env.compose` for container-specific defaults (e.g., `http://postgres:5432` instead of `localhost`)
- `.env.compose.local` to override non-secret values per developer
- `pnpm docker:prod` (which wraps `docker compose` with the secrets wrapper) to inject secrets into the host process, forwarded to the container via `environment:` name-only entries (see [Secrets](#secrets))

## Next.js Environment Variable Load Order

When running on the **host** (not Docker), Next.js resolves each environment variable by checking the following sources in order, stopping at the first match:

1. **`process.env`** — Values injected by the shell, CI, or other external sources
2. **`.env.$(NODE_ENV).local`** — e.g., `.env.development.local` or `.env.production.local`
3. **`.env.local`** — Ignored when `NODE_ENV=test`
4. **`.env.$(NODE_ENV)`** — e.g., `.env.development`, `.env.production`, or `.env.test`
5. **`.env`** — Base defaults

This means that variables set in `.env.local` override those in `.env`, and variables set in `.env.development.local` override both.

**Important:** When you start the app via `pnpm dev` (or any other wrapped script), the wrapper injects secrets into `process.env` before Next.js starts — so they win against every `.env*` file under rule 1 above. This is intentional: the secret store is the source of truth, and the env files are just non-secret defaults.

**Important:** When using Docker Compose, variables loaded via `env_file` become part of `process.env` inside the container, so they override all `.env*` files for those variables. Secrets are forwarded to the container from the outer wrapped task (not from `env_file`).

**Reference:** [Next.js Environment Variables Documentation](https://nextjs.org/docs/app/guides/environment-variables)

## Host vs Docker Configuration

### On the Host (No Docker)

Developers mainly use `.env` + `.env.local` (and optionally `.env.development.local` or `.env.production.local`) for non-secret values, and the wrapper + secret-store pipeline for secrets.

When you run `next dev` or `next build` directly, Next.js reads the files according to the load order described above. When you run the app via `pnpm dev`, the wrapper additionally injects secrets into `process.env` before Next.js starts.

**Example workflow:**

1. Clone the repo — `.env` is already there with sensible defaults.
2. `postinstall` script creates `.env.local` as a copy of `.env`; tweak per-developer non-secret values here (custom ports, feature flags, etc.).
3. Set up the secret store once (see [Secrets](#secrets)) — e.g. install and authenticate the 1Password CLI.
4. Run `pnpm dev` — the wrapper fetches secrets from the store, injects them as env vars, then starts Next.js.

### In Docker (via `docker-compose`)

The `docker-compose.yml` file uses `env_file` to inject non-secret variables into the container:

```yaml
services:
  frontend:
    container_name: infinum-react-example-frontend
    env_file:
      - ../apps/frontend/.env
      - ../apps/frontend/.env.compose
      - ../apps/frontend/.env.compose.local
    environment:
      # Forward secrets from the wrapped host environment into the container.
      # These are NOT read from any env file.
      - NEXTAUTH_SECRET
    # ... other config
```

**How this works:**

1. **`.env`** provides generic defaults.
2. **`.env.compose`** provides container-specific defaults (e.g., service names like `postgres` instead of `localhost`). Must contain no secrets.
3. **`.env.compose.local`** allows per-developer Docker overrides for non-secret values.
4. **`environment:` (without a value)** forwards a variable from the host process — where the wrapper has just injected the secret — into the container.

Because Docker Compose loads these files into `process.env`, they override any `.env*` files inside the container for those variables. Next.js sees them as already-set environment variables and uses them directly.

**Example workflow:**

1. Clone the repo — both `.env` and `.env.compose` are already there.
2. `postinstall` script creates `.env.compose.local` as a copy of `.env.compose`; tweak per-developer non-secret values here.
3. Set up the secret store once (see [Secrets](#secrets)).
4. Run `pnpm docker:prod -- up -d` (or another subcommand). The script delegates to the frontend's `docker:prod`, which wraps `docker compose` with [scripts/with-secrets.sh](../scripts/with-secrets.sh) — so secrets are resolved on the host process and compose's `environment:` block forwards them into the container.

## Secrets

### Goal

No secret values on disk. True secret values never live in `.env`, `.env.local`, `.env.compose`, `.env.compose.local`, or any other file — committed or gitignored. `.env.secret` is committed but contains only **references** (e.g. `op://vault/item/field`); resolving them requires an authenticated session to the underlying secret store. Resolved values are pulled at task-run time and injected directly into the process environment that needs them.

### How it works

A single wrapper script — [scripts/with-secrets.sh](../scripts/with-secrets.sh) — is the only place the repo names a specific secret-store CLI. It:

1. Detects which provider to use by inspecting the app's folder (`.env.secret` + `op` on PATH → 1Password). The `SECRETS_PROVIDER=` env var overrides auto-detection.
2. Execs the wrapped command under that provider's `run` mode (`op run --env-file=.env.secret -- …`), so the resolved values exist only in the child process's environment — never in a shell variable, never on disk.
3. Falls through to `exec "$@"` when no provider is configured (the CI path: secrets are already in `process.env` from the pipeline's secret provider).

Per-app pnpm scripts call the wrapper directly:

```jsonc
// apps/frontend/package.json
{
  "scripts": {
    "dev":         "NODE_OPTIONS='--inspect' ../../scripts/with-secrets.sh . -- next dev",
    "build":       "../../scripts/with-secrets.sh . -- next build",
    "start":       "../../scripts/with-secrets.sh . -- next start",
    "docker:prod": "../../scripts/with-secrets.sh . -- docker compose -f ../../docker/docker-compose.yml"
  }
}
```

### Reference setup: 1Password CLI

This project uses the 1Password CLI (`op`). Each secret is declared in [apps/frontend/.env.secret](../apps/frontend/.env.secret):

```
NEXTAUTH_SECRET=op://JS general/ReactExample/NextAuthSecret
TEST_SECRET=op://JS general/ReactExample/TestSecret
```

When `pnpm dev` runs, the wrapper invokes `op run --env-file=.env.secret -- next dev`. `op` resolves each `op://…` reference on demand from your authenticated 1Password session and sets the resolved values as environment variables for the child process. Nothing is written to disk; nothing leaks to unrelated shell commands.

### Local setup (1Password)

1. Install the 1Password CLI:
   ```sh
   brew install 1password-cli
   ```
2. In the 1Password desktop app → **Settings → Developer** → enable **Integrate with 1Password CLI**.
3. Ensure your account has access to the vault that holds the project secrets.

On first `pnpm dev`, 1Password prompts for authorization. After that, secrets are injected transparently.

### Alternative backends

1Password is the only provider wired up out of the box, but the wrapper is the single integration point — every other provider with a `run`-style CLI (Doppler, Infisical, HashiCorp Vault, AWS Secrets Manager via `chamber`, Bitwarden, etc.) plugs in by appending a `case` arm to [scripts/with-secrets.sh](../scripts/with-secrets.sh) and a corresponding manifest filename. The rest of the pipeline (the per-app pnpm scripts, `docker-compose.yml`, CI, the envsafe validators) does not name a provider, so adding one is a localized change.

To force a specific provider regardless of auto-detection, set `SECRETS_PROVIDER=<name>` in the environment.

### CI

Local developer machines use the wrapper + a local secret-store CLI, but CI runners have their own secret provider and don't need any CLI. The wrapper's `SECRETS_PROVIDER=none` fallback (auto-selected when neither a manifest nor a CLI is present) execs the command directly, so CI just runs the plain scripts with secrets supplied through the job's `env:` block:

```yaml
jobs:
  build:
    env:
      NEXTAUTH_SECRET: ${{ secrets.NEXTAUTH_SECRET }}
      TEST_SECRET:     ${{ secrets.TEST_SECRET }}
    steps:
      - run: pnpm build
```

The Playwright config in [apps/frontend-e2e/playwright.config.ts](../apps/frontend-e2e/playwright.config.ts) uses plain `pnpm --filter @infinum/frontend start` for the same reason — by the time `next start` runs in CI, the secret is already in `process.env`, regardless of whether it came from the wrapper locally or from the pipeline runner in CI.

## Adding a new environment variable

Every contributor adding an env variable needs to update a different set of files depending on (a) whether it's a secret and (b) when it's needed (runtime only vs build-time + runtime). The three scenarios below cover the cases this template supports — pick the one that matches your variable, follow the checklist, and you're done.

If you're unsure which scenario applies:

- **Is the value sensitive** (auth secret, API key, signing cert, DB password)? If yes → it's a **secret**. Pick scenario B or C.
- **Does the app read it during static rendering at build time** (e.g., a server component imports `secretEnv()` and the page is statically generated, or any `getStaticProps`-style code accesses it)? If yes → it's needed at **build time**. Pick scenario C. If only at request time / server runtime → scenario B is enough.
- **Otherwise** (non-sensitive value the client or server uses) → scenario A.

### Scenario A: non-secret variable

Examples: `API_BASE_URL`, a feature-flag name, a non-secret OAuth client ID, a port number.

1. **Default value** — Add `NAME="default-value"` to [apps/&lt;app&gt;/.env](../apps/frontend/.env). This is the host default; the file is committed.
2. **Docker default (optional)** — If the value differs inside a container (e.g., a service name instead of `localhost`), add `NAME="container-value"` to [apps/&lt;app&gt;/.env.compose](../apps/frontend/.env.compose).
3. **Per-developer overrides (no code change)** — `.env.local` and `.env.compose.local` are auto-created from the templates by [scripts/create-env-overrides.sh](../scripts/create-env-overrides.sh) on first install. Devs tweak there without touching the committed defaults.
4. **Validator** — Register the variable in:
    - [apps/&lt;app&gt;/src/lib/env/validate-env.client.ts](../apps/frontend/src/lib/env/validate-env.client.ts) — if it should be readable from client components (it gets bundled into the browser).
    - [apps/&lt;app&gt;/src/lib/env/validate-env.server.ts](../apps/frontend/src/lib/env/validate-env.server.ts) — if only the server should see it.
5. **CI (only if it differs in CI)** — If the value needs to be different in CI than in `.env`, add it to the workflow's `env:` block. Most non-secret variables don't need this — the committed `.env` defaults work.

No Dockerfile, compose runtime forwarding, or secret-store work is needed. The variable lives in plain env files.

### Scenario B: secret used only at runtime

Examples: an API key used inside route handlers, a database password the server connects with after startup.

1. **Secret store** — Create the item in your vault (e.g., a new 1Password item under the project vault). Note its reference path: `op://<vault>/<item>/<field>`.
2. **Manifest** — Add `NAME=op://<vault>/<item>/<field>` to [apps/&lt;app&gt;/.env.secret](../apps/frontend/.env.secret). This file is committed; it holds *references*, not values.
3. **Compose runtime forwarding** — In [docker/docker-compose.yml](../docker/docker-compose.yml), add `- NAME` (name only, no value) under the service's `environment:` block so compose forwards the value from the host process into the container at runtime.
4. **Validator** — Register the variable in [apps/&lt;app&gt;/src/lib/env/validate-env.server.ts](../apps/frontend/src/lib/env/validate-env.server.ts) with `'server-only'` already imported. Never add secrets to `validate-env.client.ts` — they would be bundled into the browser.
5. **Comment-fence the plain env files** — Add a comment in [apps/&lt;app&gt;/.env](../apps/frontend/.env) (and [apps/&lt;app&gt;/.env.compose](../apps/frontend/.env.compose) if the secret reaches the container) noting that the variable is injected via `.env.secret`, so contributors don't re-add a default value:
    ```
    # NAME handled through .env.secret + scripts/with-secrets.sh (see documentation/Environment variables.md)
    ```
6. **GitHub Actions secret** — In the repo's GitHub Actions settings, add `NAME` as a repository (or organization) secret with the resolved value. This is the CI counterpart to the 1Password item.
7. **CI workflows** — In every workflow that runs code touching the secret, add it to the `env:` block:
    ```yaml
    env:
      NAME: ${{ secrets.NAME }}
    ```
    Check [.github/workflows/ci.yml](../.github/workflows/ci.yml) and [.github/workflows/e2e.yml](../.github/workflows/e2e.yml) — both currently list `NEXTAUTH_SECRET` and `TEST_SECRET`; mirror that pattern.

### Scenario C: secret needed at build time too

Examples: anything envsafe validates during `next build` static rendering. In this template that includes `NEXTAUTH_SECRET` and `TEST_SECRET`, because the login page is a server component that calls `secretEnv()` and gets statically generated.

Do **everything from Scenario B**, then add:

8. **Compose build-args** — In [docker/docker-compose.yml](../docker/docker-compose.yml) under the service's `build:` block, add `NAME: ${NAME}` to the `args:` map. Compose interpolates `${NAME}` from the host process's env (which the [scripts/with-secrets.sh](../scripts/with-secrets.sh) chain has already populated for local; CI exports it via the workflow `env:` block).
9. **Dockerfile builder stage** — In [apps/&lt;app&gt;/Dockerfile](../apps/frontend/Dockerfile), add inside the `builder` stage (before `RUN pnpm build`):
    ```dockerfile
    ARG NAME
    ENV NAME=$NAME
    ```
    The `ARG` makes the build-arg visible to the stage; the `ENV` promotes it so `next build`'s envsafe check sees it. These declarations are scoped to the builder stage only — the production stage restarts `FROM base`, so values don't propagate into the final image layers.

### Touch-point matrix

The same information in matrix form, for quick reference:

| File / system                                                                            | A (non-secret) | B (runtime secret) | C (build+runtime secret) |
| ---------------------------------------------------------------------------------------- | :---: | :---: | :---: |
| Secret store (e.g. 1Password vault item)                                                 |   —   |  ✓   |  ✓   |
| `apps/<app>/.env.secret`                                                                 |   —   |  ✓   |  ✓   |
| `apps/<app>/.env` (default value or comment-fence)                                       |  ✓ value | ✓ comment | ✓ comment |
| `apps/<app>/.env.compose` (container default or comment-fence)                            |  optional | optional comment | optional comment |
| `apps/<app>/src/lib/env/validate-env.client.ts`                                          | if public | — | — |
| `apps/<app>/src/lib/env/validate-env.server.ts`                                          | if server-only |  ✓   |  ✓   |
| `docker/docker-compose.yml` — service `environment:` (runtime forwarding)                |   —   |  ✓   |  ✓   |
| `docker/docker-compose.yml` — service `build.args:` (build-time injection)               |   —   |   —   |  ✓   |
| `apps/<app>/Dockerfile` builder stage — `ARG NAME` + `ENV NAME=$NAME`                    |   —   |   —   |  ✓   |
| GitHub Actions repo settings — register `secrets.NAME`                                   |   —   |  ✓   |  ✓   |
| `.github/workflows/<wf>.yml` — add to job/workflow `env:` block                          | optional |  ✓   |  ✓   |

When in doubt, start with the more restrictive scenario (C if you're not sure whether it's build-time, B if you're not sure whether it's a secret). You can always relax later by removing the extra declarations.

### Why the wrapper uses `exec` and provider-native `run` modes

Every provider in the supported list exposes a `run` (or `exec`) subcommand that resolves references and **execs** the child with the resolved values in its environment — the values never pass through a shell variable. That avoids two classes of leak:

- **Log/expansion leaks** — a value pulled into a shell variable can show up in `set -x` output, history, or expansion errors.
- **Quoting/escaping bugs** — letting `op` (or its peers) write directly into the child's `environ` array sidesteps any shell-quoting concerns.

The wrapper itself uses `exec` for the same reason and to ensure signals propagate cleanly to long-running children like `next dev` or `docker compose up`.

### What if I don't have vault access yet?

If you're onboarding and don't yet have access to the project's 1Password vault (or equivalent), ask in the team channel to be added. As a short-term workaround you can export the required secrets manually in your shell before running `pnpm dev` — the wrapper's `none` fallback will pass them through if no provider is configured, or you can force it with `SECRETS_PROVIDER=none pnpm dev`. This is a stopgap — the wrapper + vault flow is the supported path.

## Security & Public Variables

### Public vs Private Variables

With `next-public-env`, the distinction between public and private variables is enforced by which validator you add them to:

- **Public variables** — Defined in `validate-env.client.ts`, exposed to the browser via `getPublicEnv()`
- **Private variables** — Defined in `validate-env.server.ts`, only available on the server via `secretEnv()`

**Important:** Unlike traditional Next.js, you **don't need the `NEXT_PUBLIC_` prefix**. Any variable in `validate-env.client.ts` is automatically public, regardless of its name.

**Rules:**

1. **Only variables from `validate-env.client.ts` can be used in client components** (accessed via `getPublicEnv()`).
2. **Variables from `validate-env.server.ts` can only be used in server components** (accessed via `secretEnv()`).
3. **Never put secrets in `validate-env.client.ts`** - they will be exposed to the browser.

### ⚠️ Critical Security Warning

With `next-public-env`, the separation between client and server variables is enforced at build time:

- **Client components** can only access `getPublicEnv()` - these values are publicly visible in the browser
- **Server components** can access both `getPublicEnv()` and `secretEnv()`
- If you try to import `secretEnv()` in a client component, the `'server-only'` package will throw a build error

**You must still be vigilant:**

- Never put secrets in `validate-env.client.ts` - anything there will be bundled and sent to the browser
- Only define secrets in `validate-env.server.ts` with the `'server-only'` import
- Always audit which validator you're adding new variables to
- When in doubt, start with server-only and only move to client if absolutely necessary

## Environment Validation with Envsafe

### Two-Validator Approach

The application uses a split validation approach:

- **`validate-env.client.ts`** - Validates public environment variables accessible in both client and server code
- **`validate-env.server.ts`** - Validates server-only environment variables (secrets, API keys, etc.)

This separation ensures that secrets are never accidentally bundled into the client code.

### Integration via `instrumentation.ts`

Both validators are called in `instrumentation.ts` at startup. If any required variable is missing or invalid, the app will crash immediately with a clear error message.

```typescript
// apps/frontend/src/instrumentation.ts
import { publicEnv } from './lib/env/validate-env.client';
import { secretEnv } from './lib/env/validate-env.server';

const validateEnv = () => {
	publicEnv();
	secretEnv();
};

export function register() {
	validateEnv();
}
```

## Usage Patterns

**In Client Components:**

Use `getPublicEnv()` to access public environment variables:

```typescript
'use client';

import { getPublicEnv } from '@/lib/env';

export function ClientComponent() {
	const env = getPublicEnv();

	// Type-safe access with autocomplete
	const apiUrl = env.API_BASE_URL;
	const nodeEnv = env.NODE_ENV;

	return <div>API: {apiUrl}</div>;
}
```

**In Server Components:**

Use `getPublicEnv()` for public variables, or `secretEnv()` for server-only secrets:

```typescript
import { getPublicEnv } from '@/lib/env';
import { secretEnv } from '@/lib/env/validate-env.server';

export async function ServerComponent() {
	// Access public variables
	const publicEnv = getPublicEnv();
	const apiUrl = publicEnv.API_BASE_URL;

	// Access server-only secrets
	const serverVars = secretEnv();
	const secret = serverVars.NEXTAUTH_SECRET;
	const dbUrl = serverVars.DATABASE_URL;

	return <div>...</div>;
}
```
