# Environment Variables

> **TL;DR Cheat-Sheet**
>
> 1. **Committed templates** &mdash; `.env` and `.env.compose` are tracked in git with non-secret defaults.
> 1. **Developer overrides** &mdash; All `*.local` files are ignored and never committed.
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

The monorepo uses a repeatable pattern for environment variables that works both on the host machine and inside Docker containers. Each app maintains committed template files with non-secret defaults, while developers add their own secrets and overrides in local files that are never committed.

### High-Level Goals

Each application has:

- **`.env`** &mdash; Committed, non-secret host defaults for running the app on your local machine.
- **`.env.compose`** &mdash; Committed, non-secret Docker defaults for running the app in containers.
- **`*.local` files** &mdash; Developer-specific overrides and secrets, never committed to git.

We use:

- **envsafe** for runtime validation of environment variables (fail-fast on missing/invalid values).
- **next-public-env** for accessing environment variables in a type-safe way, with separate client and server validators.
- Two validator files: `validate-env.client.ts` for public variables and `validate-env.server.ts` for server-only variables.

Key goals:

- **No "works on my machine" bugs** - host and container values are isolated.
- **No secrets in git** - templates provide defaults; developers add secrets locally.
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

1. **Never put secrets in `.env` or `.env.compose`** &mdash; these files are committed and visible to everyone.
2. **Use `.local` files for secrets** &mdash; add API keys, passwords, and other sensitive values to `.env.local` or `.env.compose.local`.
3. **Templates are for defaults** &mdash; committed files should contain example values, localhost URLs, and other non-sensitive defaults.

## Next.js Environment File Reference

Each application uses multiple environment files with different purposes and precedence:

| File                          | Purpose                                                      | Tracked in Git? | Used Where |
| ----------------------------- | ------------------------------------------------------------ | --------------- | ---------- |
| `.env`                        | Host defaults (local dev on your machine)                    | **Yes**         | Host       |
| `.env.local`                  | Host-only overrides & secrets for this developer             | **No**          | Host       |
| `.env.development.local`      | Optional host-only overrides when `NODE_ENV=development`     | **No**          | Host       |
| `.env.production.local`       | Optional host-only overrides when `NODE_ENV=production`      | **No**          | Host       |
| `.env.test.local`             | Optional host-only overrides when `NODE_ENV=test`            | **No**          | Host       |
| `.env.compose`                | Docker defaults (typically using service names)              | **Yes**         | Docker     |
| `.env.compose.local`          | Docker-only overrides & secrets for this developer           | **No**          | Docker     |

### Host vs Docker Usage

**Host (Running on Your Machine):**

When you run `next dev` or similar commands directly on your machine (not in Docker), Next.js reads `.env*` files in a specific order (see next section). Typically you'll use:

- `.env` for generic defaults
- `.env.local` to override values or add secrets

**Docker (Running in Containers):**

When you run via `docker-compose up`, the `env_file` entries in `docker-compose.yml` load variables directly into the container's `process.env`. These bypass the Next.js file loading and take highest precedence. Typically you'll use:

- `.env` for generic defaults
- `.env.compose` for container-specific defaults (e.g., `http://postgres:5432` instead of `localhost`)
- `.env.compose.local` to override values or add secrets for Docker

## Next.js Environment Variable Load Order

When running on the **host** (not Docker), Next.js resolves each environment variable by checking the following sources in order, stopping at the first match:

1. **`process.env`** &mdash; Values injected by the shell, CI, or other external sources
2. **`.env.$(NODE_ENV).local`** &mdash; e.g., `.env.development.local` or `.env.production.local`
3. **`.env.local`** &mdash; Ignored when `NODE_ENV=test`
4. **`.env.$(NODE_ENV)`** &mdash; e.g., `.env.development`, `.env.production`, or `.env.test`
5. **`.env`** &mdash; Base defaults

This means that variables set in `.env.local` override those in `.env`, and variables set in `.env.development.local` override both.

**Important:** When using Docker Compose, variables loaded via `env_file` become part of `process.env` inside the container, so they override all `.env*` files for those variables.

**Reference:** [Next.js Environment Variables Documentation](https://nextjs.org/docs/app/guides/environment-variables)

## Host vs Docker Configuration

### On the Host (No Docker)

Developers mainly use `.env` + `.env.local` (and optionally `.env.development.local` or `.env.production.local`).

When you run `next dev` or `next build`, Next.js reads the files according to the load order described above.

**Example workflow:**

1. Clone the repo - `.env` is already there with sensible defaults.
2. `postinstall` script creates `.env.local` which is a copy of `.env` file; add your secrets there (API keys, database passwords, etc.).
3. Run `next dev` - your local overrides take precedence.

### In Docker (via `docker-compose`)

The `docker-compose.yml` file uses `env_file` to inject variables into the container:

```yaml
services:
  frontend:
    container_name: infinum-react-example-frontend
    env_file:
      - ../apps/frontend/.env
      - ../apps/frontend/.env.compose
      - ../apps/frontend/.env.compose.local
    # ... other config
```

**How this works:**

1. **`.env`** provides generic defaults.
2. **`.env.compose`** provides container-specific defaults (e.g., service names like `postgres` instead of `localhost`).
3. **`.env.compose.local`** allows per-developer Docker overrides and secrets.

Because Docker Compose loads these files into `process.env`, they override any `.env*` files inside the container for those variables. Next.js sees them as already-set environment variables and uses them directly.

**Example workflow:**

1. Clone the repo - both `.env` and `.env.compose` are already there.
2. `postinstall` script creates `.env.compose.local` which is a copy of `.env.compose` file; add your Docker-specific secrets there.
3. Run `docker-compose up` - your local overrides take precedence.

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
