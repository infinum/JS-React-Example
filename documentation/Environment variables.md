# Environment Variables

> **TL;DR Cheat-Sheet**
>
> 1. **Committed templates** &mdash; `.env` and `.env.compose` are tracked in git with non-secret defaults.
> 1. **Developer overrides** &mdash; All `*.local` files are ignored and never committed. Use them for personal non-secret tweaks (ports, feature flags), not real secrets.
> 1. **Secrets** &mdash; Never written to disk. Injected at task-run time by [mise](https://mise.jdx.dev/) from a secret-store CLI (1Password by default — see [Secrets](#secrets)).
> 1. **Two validators** &mdash; `validate-env.client.ts` for public vars, `validate-env.server.ts` for secrets.
> 1. **Type-safe access** &mdash; Use `getPublicEnv()` for public vars, `secretEnv()` for secrets.
> 1. Variables in `validate-env.client.ts` are exposed to the browser (no `NEXT_PUBLIC_` prefix needed).
> 1. Never put secrets in `validate-env.client.ts` - only in `validate-env.server.ts`.
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

- **`.env`** &mdash; Committed, non-secret host defaults for running the app on your local machine.
- **`.env.compose`** &mdash; Committed, non-secret Docker defaults for running the app in containers.
- **`*.local` files** &mdash; Developer-specific non-secret overrides, never committed to git.
- **Secrets** &mdash; Not in any file. Injected at task-run time by mise from a secret-store CLI (1Password by default) locally, and from the pipeline's secret provider (e.g. GitHub Actions secrets) in CI.

We use:

- **envsafe** for runtime validation of environment variables (fail-fast on missing/invalid values).
- **next-public-env** for accessing environment variables in a type-safe way, with separate client and server validators.
- Two validator files: `validate-env.client.ts` for public variables and `validate-env.server.ts` for server-only variables.

Key goals:

- **No "works on my machine" bugs** - host and container values are isolated.
- **No secrets in git** - templates and `.local` files carry non-secret defaults only.
- **No secrets on disk** - real secrets are fetched on demand and live only in the process environment that needs them.
- **Early failure** - missing or malformed variables abort the start-up sequence.
- **Type safety** - the `envsafe()` helper supplies autocomplete and correct types.

## Git & File Rules

The apps should use the following `.gitignore` rules for environment files:

```gitignore
# Environment variables
.env*
!.env
!.env.compose
```

### What This Means

**Only `.env` and `.env.compose` are tracked in git.**

All other `.env*` files are ignored, including:

- `.env.local`
- `.env.development.local`
- `.env.production.local`
- `.env.test.local`
- `.env.compose.local`

### Important Rules

1. **Never put secrets in any env file** &mdash; not in committed templates (`.env`, `.env.compose`) and not in gitignored `.local` files. Secrets always come from the [Secrets](#secrets) pipeline.
2. **Use `.local` files for non-secret developer overrides** &mdash; per-developer ports, feature flags, alternate URLs, etc. If a value is truly sensitive, it belongs in the secret store, not here.
3. **Templates are for defaults** &mdash; committed files should contain example values, localhost URLs, and other non-sensitive defaults. When a secret-bearing variable is handled by mise, add a comment pointing at this guide so contributors don't re-add it to the file.

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
| *(mise task env)*             | Secrets — fetched from the secret store at task-run time        | n/a (not a file) | Host / Docker-via-host |

### Host vs Docker Usage

**Host (Running on Your Machine):**

When you run `next dev` or similar commands directly on your machine (not in Docker), Next.js reads `.env*` files in a specific order (see next section). Typically you'll use:

- `.env` for generic defaults
- `.env.local` to override non-secret values per developer
- The mise task (e.g. `mise dev`) to inject secrets on top (see [Secrets](#secrets))

**Docker (Running in Containers):**

When you run via `docker-compose up`, the `env_file` entries in `docker-compose.yml` load variables directly into the container's `process.env`. These bypass the Next.js file loading and take highest precedence. Typically you'll use:

- `.env` for generic defaults
- `.env.compose` for container-specific defaults (e.g., `http://postgres:5432` instead of `localhost`)
- `.env.compose.local` to override non-secret values per developer
- A mise task wrapping `docker compose` to inject secrets into the host process, forwarded to the container via `environment:` name-only entries (see [Secrets](#secrets))

## Next.js Environment Variable Load Order

When running on the **host** (not Docker), Next.js resolves each environment variable by checking the following sources in order, stopping at the first match:

1. **`process.env`** &mdash; Values injected by the shell, CI, or other external sources
2. **`.env.$(NODE_ENV).local`** &mdash; e.g., `.env.development.local` or `.env.production.local`
3. **`.env.local`** &mdash; Ignored when `NODE_ENV=test`
4. **`.env.$(NODE_ENV)`** &mdash; e.g., `.env.development`, `.env.production`, or `.env.test`
5. **`.env`** &mdash; Base defaults

This means that variables set in `.env.local` override those in `.env`, and variables set in `.env.development.local` override both.

**Important:** When you start the app via a mise task (e.g. `mise dev`), any secrets the task injects are present in `process.env` by the time Next.js starts — so they win against every `.env*` file under rule 1 above. This is intentional: the secret store is the source of truth, and the env files are just non-secret defaults.

**Important:** When using Docker Compose, variables loaded via `env_file` become part of `process.env` inside the container, so they override all `.env*` files for those variables. Secrets are forwarded to the container from the outer mise task (not from `env_file`).

**Reference:** [Next.js Environment Variables Documentation](https://nextjs.org/docs/app/guides/environment-variables)

## Host vs Docker Configuration

### On the Host (No Docker)

Developers mainly use `.env` + `.env.local` (and optionally `.env.development.local` or `.env.production.local`) for non-secret values, and the mise + secret-store pipeline for secrets.

When you run `next dev` or `next build`, Next.js reads the files according to the load order described above. When you run the app via `mise dev`, mise additionally injects secrets into `process.env` before Next.js starts.

**Example workflow:**

1. Clone the repo — `.env` is already there with sensible defaults.
2. `postinstall` script creates `.env.local` as a copy of `.env`; tweak per-developer non-secret values here (custom ports, feature flags, etc.).
3. Set up the secret store once (see [Secrets](#secrets)) — e.g. install and authenticate the 1Password CLI.
4. Run `mise dev` — mise fetches secrets from the store, injects them as env vars, then starts Next.js.

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
      # Forward secrets from the mise-wrapped host environment into the container.
      # These are NOT read from any env file.
      - NEXTAUTH_SECRET
    # ... other config
```

**How this works:**

1. **`.env`** provides generic defaults.
2. **`.env.compose`** provides container-specific defaults (e.g., service names like `postgres` instead of `localhost`). Must contain no secrets.
3. **`.env.compose.local`** allows per-developer Docker overrides for non-secret values.
4. **`environment:` (without a value)** forwards a variable from the host process — where mise has just injected the secret — into the container.

Because Docker Compose loads these files into `process.env`, they override any `.env*` files inside the container for those variables. Next.js sees them as already-set environment variables and uses them directly.

**Example workflow:**

1. Clone the repo — both `.env` and `.env.compose` are already there.
2. `postinstall` script creates `.env.compose.local` as a copy of `.env.compose`; tweak per-developer non-secret values here.
3. Set up the secret store once (see [Secrets](#secrets)).
4. Run `mise docker:prod` (or whichever mise task wraps compose) — the task fetches secrets, exports them to its own environment, and then invokes `docker compose …` so the `environment:` block forwards them to the container.

## Secrets

### Goal

No secret values on disk. True secrets never live in `.env`, `.env.local`, `.env.compose`, `.env.compose.local`, or any other file — committed or gitignored. Instead they are pulled from a secure store at task-run time and injected directly into the process environment that needs them.

### Reference setup: 1Password CLI + mise

We use [mise](https://mise.jdx.dev/) tasks to inject secrets fetched via the 1Password CLI (`op`). The canonical configuration lives in [apps/frontend/mise.toml](../apps/frontend/mise.toml). Each entry under `[tasks.<name>].env` uses mise's command-substitution templating to shell out to `op read`, so the value is fetched on demand from a vault item such as `op://<vault>/<item>/<field>`.

Relevant settings on the mise file:

- `env_shell_expand = false` &mdash; critical, see [Why it matters](#why-env_shell_expand--false).
- `[tasks.dev].env` &mdash; declares each secret variable and the `op read` call that resolves it.

When `mise dev` runs, mise evaluates those templates and sets the resulting values as environment variables for the task process only — nothing is written to disk, nothing leaks to unrelated shell commands.

### Local setup (1Password)

1. Install the 1Password CLI:
   ```sh
   brew install 1password-cli
   ```
2. In the 1Password desktop app → **Settings → Developer** → enable **Integrate with 1Password CLI**.
3. Ensure your account has access to the vault that holds the project secrets.

On first `mise dev`, 1Password prompts for authorization. After that, secrets are injected transparently.

### Alternative backends

1Password is the reference setup for this project, but the same mise pattern works with any CLI-accessible secret store. Teams on other projects may prefer:

- **Apple Keychain** — `security find-generic-password -w -s <service> -a <account>`
- **pass** (Unix password manager) — `pass show <path>`
- **Bitwarden CLI** — `bw get password <item>`
- **HashiCorp Vault** — `vault kv get -field=value <path>`
- **AWS Secrets Manager** — `aws secretsmanager get-secret-value --secret-id <id> --query SecretString --output text`
- **GCP Secret Manager** — `gcloud secrets versions access latest --secret=<name>`

The pattern is always the same: wrap the CLI call in mise's command-substitution template inside the relevant task's `env` block. The rest of the pipeline (validators, the `secretEnv()` accessor, container forwarding) does not care which backend produced the value.

### Secrets in CI

Local developer machines use mise + a local secret-store CLI, but CI runners have their own secret provider and don't need 1Password access. In GitHub Actions, for example, secrets are stored in repository/org secrets and injected via the job's `env:` block or `secrets:` context:

```yaml
jobs:
  e2e:
    env:
      NEXTAUTH_SECRET: ${{ secrets.NEXTAUTH_SECRET }}
      TEST_SECRET:     ${{ secrets.TEST_SECRET }}
    steps:
      - run: pnpm e2e
```

From the app's point of view the two paths are indistinguishable — by the time the Next.js process starts, the secret is already in `process.env`, regardless of whether it came from mise locally or from the pipeline runner in CI.

### Adding a new secret

1. Add the value to the secret store (e.g. create a new 1Password item under the project vault, **and** register it as a GitHub Actions secret for CI).
2. Add an entry to `apps/<app>/mise.toml` under the relevant `[tasks.*].env` block, using mise's command-substitution template to shell out to the local CLI.
3. Forward it in `docker/docker-compose.yml` under the service's `environment:` block (name only, no value) if the secret needs to reach the container.
4. Register the variable in [validate-env.server.ts](../apps/frontend/src/lib/env/validate-env.server.ts) so it fails fast if missing.
5. Add a comment to the app's `.env` (and `.env.compose` if applicable) noting that the variable is injected via mise, so contributors don't re-add it to the file.
6. Update the CI workflow to pass the secret through `env:` from the pipeline's secret provider.

### Why `env_shell_expand = false`

Without this setting, mise would pass `env` values through shell expansion before running the task. That risks leaking the secret (e.g. through a visible expansion in logs) and misinterpreting quoting in the template. With shell expansion disabled, only mise's own templating engine evaluates the command-substitution calls — the fetched value is written directly into the child process's environment, never touching a shell.

### What if I don't have vault access yet?

If you're onboarding and don't yet have access to the project's 1Password vault (or equivalent), ask in the team channel to be added. As a short-term workaround you can export the required secrets manually in your shell before running `pnpm dev` directly (bypassing mise), but this is a stopgap — the mise + vault flow is the supported path.

## Security & Public Variables

### Public vs Private Variables

With `next-public-env`, the distinction between public and private variables is enforced by which validator you add them to:

- **Public variables** &mdash; Defined in `validate-env.client.ts`, exposed to the browser via `getPublicEnv()`
- **Private variables** &mdash; Defined in `validate-env.server.ts`, only available on the server via `secretEnv()`

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
