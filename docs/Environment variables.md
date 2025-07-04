# Environment Variables

> **TL;DR Cheat-Sheet**
>
> 1. **Two template files per app** &mdash; `.env.local` (host) and `.env.compose` (Docker).
> 1. **Override with secrets** in `.env.$(NODE_ENV).local`.
> 1. **Validate everything** in `src/lib/env/validate-env.ts` using **envsafe**.
> 1. Only keys that start with **`NEXT_PUBLIC_`** should be used in client components.
> 1. Treat any private key in a client component as a **production-blocking bug**.
>
> **!! WARNING !!**
>
> If you accidentally reference a private key in a client component the browser will log an error after the sensitive value has already been shipped. Treat this as a fatal mistake.

## Overview

The monorepo uses a repeatable pattern for environment variables that works both on the host machine and inside Docker containers.
Key goals:

- **No “works on my machine” bugs** - host and container values are isolated.
- **Early failure** - missing or malformed variables abort the start-up sequence via **envsafe**.
- **Type safety** - the `env()` helper supplies autocomplete and correct types.

## File Layout

| File                     | Purpose                                                                                                                                              | Tracked in Git? |
| ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------- | --------------- |
| `.env.local`             | Template values for host-side Node.js processes (`next dev`, Storybook, etc. - ignored when `NODE_ENV=test`)                                         | **Yes**         |
| `.env.compose`           | Template values for the same app when run via Docker Compose.                                                                                        | **Yes**         |
| `.env.$(NODE_ENV).local` | Files created during bootstrap, used to override the example variables with secrets, for example `.env.development.local` or `.env.production.local` | **No**          |

Commiting a **template** file keeps secrets out of the repo while giving new contributors a friction-free setup.

## Configuration Pattern

### Docker Compose Configuration

Each frontend application should have its own environment file referenced in `docker/docker-compose.yml`:

```yaml
services:
  web:
    # ... other config
    env_file:
      - ../apps/web/.env.compose

  # Future applications would follow the same pattern:
  # admin:
  #   env_file:
  #     - ../apps/admin/.env.compose
  #     - ../apps/admin/.env.compose.local
```

### Separate Environment Files

Each application maintains two separate environment files because service addresses differ between processes running in Node.js on the host machine and in Docker containers:

- **`.env.local`** - Used for local development (Node.js processes on host machine)
- **`.env.compose`** - Used for Docker containerized processes

This separation ensures that services can properly communicate regardless of where they're running.

## Next.js Runtime Environment (Example: Web App)

The web application demonstrates the complete setup pattern:

### PublicEnvScript Component

The app uses `next-runtime-env` to allow dynamic environment variables for client components:

```tsx
// apps/web/src/app/layout.tsx
import { PublicEnvScript } from 'next-runtime-env';

<head>
	<PublicEnvScript />
</head>;
```

This component automatically exposes all environment variables prefixed with `NEXT_PUBLIC_` to the browser.

### ⚠️ Important Security Warning

**Using private variables in client components will show a browser error during rendering, BUT IT WILL NOT PREVENT the variable from being included in the initial HTML document.**

`next-runtime-env` is isomorphic - the server renders the variable and it hydrates in the browser, but then throws an error. You must be aware of this behavior and careful about what you expose to client components.

### Type-Safe Environment Access

The web app overrides the `next-runtime-env` `env()` method in `apps/web/src/lib/env/env.d.ts` for better developer experience, providing full TypeScript support and autocomplete for environment variables.

## Environment Validation

### Envsafe Integration

Applications use `envsafe` in their `instrumentation.ts` to validate environment variables at startup. The web app example:

```typescript
// apps/web/src/instrumentation.ts
import { validateEnvironmentVariables } from './lib/env/validate-env';

export function register() {
	validateEnvironmentVariables();
}
```

### Validation Configuration

Environment variable validation is configured in each app's `validate-env.ts` file. This file defines:

- Required vs optional variables
- Type constraints and choices
- Descriptions for better documentation
- Default values where appropriate

Example from the web app:

```typescript
// apps/web/src/lib/env/validate-env.ts
export const validateEnvironmentVariables = () => {
	const env = envsafe({
		NODE_ENV: str({
			input: process.env.NODE_ENV,
			choices: ['development', 'test', 'production'],
		}),
		NEXTAUTH_SECRET: str({
			input: process.env.NEXTAUTH_SECRET,
			desc: 'A secure random string used by NextAuth',
		}),
		NEXT_PUBLIC_EXAMPLE_VARIABLE: str({
			input: process.env.NEXT_PUBLIC_EXAMPLE_VARIABLE,
			allowEmpty: true,
		}),
		PRIVATE_EXAMPLE_VARIABLE: str({
			input: process.env.PRIVATE_EXAMPLE_VARIABLE,
		}),
	});

	console.info('✅ Environment variables validated.');
	return env;
};
```

## Adding New Environment Variables

When adding a new environment variable to any application, follow these steps:

### 1. Add to Environment Files

Add the variable to both `.env.local` and `.env.compose` files with appropriate comments:

```bash
# apps/your-app/.env.local
NEXT_PUBLIC_NEW_VARIABLE="Local Development Value"

# apps/your-app/.env.compose
NEXT_PUBLIC_NEW_VARIABLE="Docker Container Value"
```

### 2. Add to Validation

Add the variable to the app's `validate-env.ts` file:

```typescript
NEXT_PUBLIC_NEW_VARIABLE: str({
  input: process.env.NEXT_PUBLIC_NEW_VARIABLE,
  allowEmpty: true, // if optional
  desc: 'Description of what this variable does',
}),
```

### 3. Security Considerations

- **Public variables** (prefixed with `NEXT_PUBLIC_`) are exposed to the browser and can be used in client components
- **Private variables** should never be used in client components as they will cause runtime errors and may expose sensitive data
- Always validate that private variables are not accidentally included in the client bundle

### 4. Usage

Access environment variables using the `env()` function:

```typescript
import { env } from '@/lib/env';

// In server components
const value = env('NEXT_PUBLIC_NEW_VARIABLE');

// In client components (only public variables)
const publicValue = env('NEXT_PUBLIC_NEW_VARIABLE');
```

## Setting Up Environment Variables for New Applications

### 1. Create Environment Files

For each new frontend application, create two environment files in the app directory:

```bash
# apps/your-app/.env.local
# apps/your-app/.env.compose
```

### 2. Configure Docker Compose

Add the new service to `docker/docker-compose.yml` with its environment file:

```yaml
services:
  your-app:
    container_name: infinum-react-example-your-app
    env_file:
      - ../apps/your-app/.env.compose
      - ../apps/your-app/.env.compose.local
    # ... other config
```

### 3. Set Up Validation (For Next.js Applications)

Create validation infrastructure in your app:

```typescript
// apps/your-app/src/lib/env/validate-env.ts
import { envsafe, str } from 'envsafe';

export const validateEnvironmentVariables = () => {
	const env = envsafe({
		NODE_ENV: str({
			input: process.env.NODE_ENV,
			choices: ['development', 'test', 'production'],
		}),
		// Add your app-specific variables here
	});

	console.info('✅ Environment variables validated.');
	return env;
};
```

### 4. Add Instrumentation

Create instrumentation file:

```typescript
// apps/your-app/src/instrumentation.ts
import { validateEnvironmentVariables } from './lib/env/validate-env';

export function register() {
	validateEnvironmentVariables();
}
```

### 5. Set Up Type Safety

Create type override for better developer experience:

```typescript
// apps/your-app/src/lib/env/env.d.ts
import 'next-runtime-env';
import { validateEnvironmentVariables } from './validate-env';

type Environment = ReturnType<typeof validateEnvironmentVariables>;

declare module 'next-runtime-env' {
	export function env<T extends keyof Environment>(key: T): Environment[T];
}
```

## Repository Structure

The environment variable setup follows this structure for each application:

```
apps/
├── web/
│   ├── .env.local
│   ├── .env.compose
│   └── src/
│       ├── instrumentation.ts
│       └── lib/
│           └── env/
│               ├── validate-env.ts
│               ├── env.d.ts
│               └── index.ts
└── your-new-app/
    ├── .env.local
    ├── .env.compose
    └── src/
        ├── instrumentation.ts
        └── lib/
            └── env/
                ├── validate-env.ts
                ├── env.d.ts
                └── index.ts
```

This pattern ensures consistency across all applications while maintaining proper isolation and type safety.
