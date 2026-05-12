# Docker Setup

This document explains the Docker setup and containerization strategy for the monorepo.

## Overview

The repository uses a Docker setup that emphasizes application independence while leveraging monorepo benefits. Each application can be built and deployed independently, yet shares common infrastructure and tooling.

## Individual Dockerfiles per Application

### Why Each App Has Its Own Dockerfile

Each application in the monorepo maintains its own Dockerfile in its respective directory:

```
apps/
├── frontend/
│   └── Dockerfile
└── storybook/
    └── Dockerfile
```

**Benefits of this approach:**

1. **Application Independence** - Each app can define its own build process, runtime requirements, and deployment strategy
2. **Technology Flexibility** - Different apps can use different base images, runtime environments, or deployment targets
3. **Optimized Builds** - Each Dockerfile can be optimized for its specific application needs
4. **Isolated Dependencies** - Applications don't interfere with each other's Docker build process

### Dockerfile Structure Pattern

All Dockerfiles follow a consistent multi-stage build pattern:

```dockerfile
# Base stage - Common Node.js setup
FROM node:24.15.0-alpine AS base

# Turbo prune stage - Monorepo optimization
FROM base AS turbo
RUN pnpm dlx turbo@2.4.2 prune @infinum/app-name --docker

# Dependencies stage - Install packages
FROM base AS dependencies
RUN pnpm install --frozen-lockfile

# Development stage - For local development
FROM dependencies AS development

# Builder stage - Build the application
FROM development AS builder
RUN pnpm build

# Production stage - Final runtime image
FROM base AS production
```

### Turbo Prune Integration

Each Dockerfile uses Turbo's prune feature to optimize the build context:

```dockerfile
FROM base AS turbo
COPY . .
RUN pnpm dlx turbo@2.4.2 prune @infinum/frontend --docker
```

This creates a minimal subset of the monorepo containing only the files needed for the specific application, significantly reducing build time and image size.

## Environment Variables Strategy

### App-Level Environment Files

Each application maintains its (non-secret) environment variables within its own directory:

```
apps/
├── frontend/
│   ├── .env.local
│   └── .env.compose
└── storybook/
    ├── .env.local
    └── .env.compose
```

**Why this approach:**

1. **Isolation** - Each app manages its own configuration without affecting others
2. **Independence** - Applications can be extracted from the monorepo without losing configuration
3. **Clarity** - Environment variables are co-located with the application that uses them
4. **Flexibility** - Different environments (local vs Docker) can have different configurations

Only non-secret values live in these files. Real secrets are injected at task-run time by [scripts/with-secrets.sh](../scripts/with-secrets.sh) from a secret store (1Password by default; see the [Environment Variables guide](./Environment%20variables.md#secrets)) and forwarded into the container at runtime, not read from any committed or gitignored env file.

### Docker Compose Integration

The `docker-compose.yml` references each application's environment file for non-secret defaults, forwards runtime secrets from the wrapped host process via `environment:` name-only entries, and passes the same secrets as `build.args` so `next build` can validate them via envsafe during static rendering:

```yaml
services:
  frontend:
    build:
      context: ..
      dockerfile: ./apps/frontend/Dockerfile
      target: production
      args:
        # Build-time: compose interpolates ${NAME} from the host's env.
        # The scripts/with-secrets.sh chain has already populated it.
        # Declared as ARG in the Dockerfile's builder stage; ENV-promoted
        # only inside that stage so `next build` can read it. The
        # production stage restarts FROM base, so the value does not
        # propagate into the final image.
        NEXTAUTH_SECRET: ${NEXTAUTH_SECRET}
        TEST_SECRET: ${TEST_SECRET}
    env_file:
      - ../apps/frontend/.env
      - ../apps/frontend/.env.compose
    environment:
      # Runtime: forwarded from the host process. Locally these are
      # populated by scripts/with-secrets.sh resolving
      # apps/frontend/.env.secret refs; in CI they come from the
      # pipeline's secret provider. No value here — compose passes
      # whatever is in the parent environment.
      - NEXTAUTH_SECRET
  storybook:
    # No env_file or secrets needed for storybook in this example
```

### Why both `build.args` and `environment:`

`build.args` are baked into the *build* of the image (consumed by `next build` for envsafe validation during static rendering). They are scoped to the builder stage only — the production stage restarts `FROM base`, so the values never reach the final image's layers. `environment:` forwards the same values into the *running container* so the Next.js server (and its instrumentation hook) can see them at startup. Both are needed because the build container and the runtime container are distinct processes with separate env namespaces; both must carry the secret.

### Running compose

The root-level `pnpm docker:prod` script invokes [scripts/compose.sh](../scripts/compose.sh) — a generic driver that wraps `docker compose` with one [scripts/with-secrets.sh](../scripts/with-secrets.sh) layer per app under `apps/`. Each layer injects that app's secrets (resolved by the configured provider CLI) into the parent process; compose's per-service `environment:` blocks then forward only what each container asks for.

```sh
pnpm docker:prod -- up -d        # builds and starts the prod stack
pnpm docker:prod -- up frontend  # brings up just one service
pnpm docker:prod -- logs -f      # tails logs
pnpm docker:prod -- down         # tears it down
```

Under the hood, the driver builds a chain like:

```
pnpm docker:prod -- up -d
  → ./scripts/compose.sh up -d
    → with-secrets.sh apps/storybook --
      → with-secrets.sh apps/frontend-e2e --
        → with-secrets.sh apps/frontend --
          → op run --env-file=apps/frontend/.env.secret --
            → docker compose -f docker/docker-compose.yml up -d
```

Apps without a `.env.secret` (or other supported manifest) fall through to plain `exec` inside their `with-secrets.sh` layer — wrapping them is one cheap shell hop, no provider work. Apps with a manifest but no matching CLI on PATH produce a warning to stderr so the misconfiguration is visible at the call site.

### Adding a new app's secrets

The driver discovers apps by globbing `apps/*/`, so adding a second app with its own vault is a zero-edit operation at the root — the next `pnpm docker:prod` run wraps the new manifest automatically. No changes to root `package.json`, `compose.sh`, or any other app's config.

For the per-secret touch points (manifest, compose forwarding, build-args, Dockerfile `ARG`/`ENV`, CI workflow `env:` blocks, etc.) see the canonical checklist: [Environment Variables — Adding a new environment variable](./Environment%20variables.md#adding-a-new-environment-variable).

### Multi-app secrets: one chain, per-service forwarding

When multiple apps each declare their own secrets, the driver layers them so the host process has all secrets in env by the time `docker compose up` runs. **Compose's `environment:` block is what enforces isolation between services** — each service forwards only the names it lists. So even though the host process briefly holds both frontend's and backend's secrets, the frontend container only sees `NEXTAUTH_SECRET`, the backend container only sees `DATABASE_PASSWORD`, and storybook sees nothing.

A subtle footgun worth knowing about: **don't share secret *names* between apps.** If `apps/frontend/.env.secret` and `apps/backend/.env.secret` both declare `API_KEY`, the layer that runs last wins for that name in the host process — and both services' `environment: - API_KEY` blocks will receive the same value. Use app-scoped names (`FRONTEND_API_KEY`, `BACKEND_API_KEY`) so each app's secret namespace stays disjoint.

### CI

The wrapper auto-detects that no provider CLI is present and falls through to plain `exec`. Secrets come from the pipeline's secret provider (e.g. GitHub Actions `secrets`) exported to the job's `env:` block, and compose forwards them to the container the same way. The compose file itself does not need to change between local and CI use.

## Application Independence Principle

### Why Apps Should Work Independently

Each application is designed to function as if it's not part of a monorepo:

1. **Extractability** - Any app can be moved to its own repository with minimal changes
2. **Team Autonomy** - Different teams can work on different apps without coordination overhead
3. **Deployment Flexibility** - Apps can be deployed independently to different environments
4. **Technology Evolution** - Each app can adopt new technologies at its own pace

### Implementation Details

- **Individual package.json** - Each app has its own dependencies and scripts
- **Separate TypeScript configs** - Each app can have different TypeScript settings
- **Independent build processes** - Apps don't depend on each other's build artifacts
- **Isolated environment variables** - No shared environment configuration

## Docker Compose Configuration

### Centralized Compose File

The `docker-compose.yml` is located in the `/docker` directory:

```
docker/
└── docker-compose.yml
```

**Benefits of this location:**

1. **Separation of Concerns** - Docker configuration is separate from application code
2. **Infrastructure as Code** - All deployment configuration is in one place
3. **Easy Discovery** - Developers know where to find Docker configuration
4. **Version Control** - Docker configuration changes are tracked separately

### Service Configuration

Each service in the compose file follows a consistent pattern:

```yaml
services:
  frontend:
    container_name: infinum-react-example-frontend
    image: infinum-react-example-frontend
    restart: unless-stopped
    build:
      context: ..              # Build from repository root
      dockerfile: ./apps/frontend/Dockerfile
      target: production       # Use production stage
    ports:
      - '3000:3000'
    environment:
      - HOSTNAME=0.0.0.0      # Next.js specific
    env_file:
      - ../apps/frontend/.env.compose
```

## Docker Scripts and Usage

### Production Script

The root `package.json` exposes the compose driver as `docker:prod`:

```json
{
  "scripts": {
    "docker:prod": "./scripts/compose.sh"
  }
}
```

The driver ([scripts/compose.sh](../scripts/compose.sh)) wraps `docker compose -f docker/docker-compose.yml` with one [scripts/with-secrets.sh](../scripts/with-secrets.sh) layer per app under `apps/` — see [Running compose](#running-compose) for the full call chain.

### Flexible Usage Patterns

This script can be used in multiple ways:

```bash
# Start all services
pnpm docker:prod up --build

# Start specific service
pnpm docker:prod up frontend --build

# Start in detached mode
pnpm docker:prod up -d

# View logs
pnpm docker:prod logs -f frontend

# Stop all services
pnpm docker:prod down

# Rebuild specific service
pnpm docker:prod build frontend
```

### Development vs Production

The Dockerfiles support both development and production targets:

```bash
# Development mode (with hot reload)
docker build --target development -t app-dev .

# Production mode (optimized)
docker build --target production -t app-prod .
```

## Build Optimization

### Multi-Stage Builds

Each Dockerfile uses multi-stage builds to minimize final image size:

- **Base stage** - Common setup (Node.js, pnpm)
- **Turbo stage** - Monorepo pruning
- **Dependencies stage** - Package installation
- **Development stage** - Development-ready image
- **Builder stage** - Application building
- **Production stage** - Minimal runtime image

### Caching Strategy

The build process is optimized for Docker layer caching:

1. **Dependency installation** happens before code copying
2. **Package.json changes** trigger dependency reinstallation
3. **Code changes** don't invalidate dependency layers
4. **pnpm cache** is mounted for faster installs

```dockerfile
# Cache mount for faster installs
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install
```

## Application-Specific Considerations

### Next.js Applications (Frontend)

- Uses `output: 'standalone'` for optimized Docker images
- Requires `HOSTNAME=0.0.0.0` environment variable
- Serves static files and API routes from a single container

### Storybook Applications

- Uses Nginx for static file serving
- Includes custom entrypoint script for startup messaging
- Optimized for documentation and component library hosting

## Best Practices

### Adding New Applications

When adding a new application to the monorepo:

1. **Create Dockerfile** in the app directory following the established pattern.
2. **Add non-secret environment files** (`.env`, `.env.compose`) with defaults only.
3. **Add secrets** per the canonical checklist in [Environment Variables — Adding a new environment variable](./Environment%20variables.md#adding-a-new-environment-variable). Touch points include `.env.secret`, the compose service's `environment:` and `build.args:` blocks, the Dockerfile builder stage's `ARG`/`ENV` pairs, the validator, and the CI workflow `env:` blocks.
4. **Update docker-compose.yml** with the new service.
5. **Test independence** - ensure the app works without monorepo dependencies.

### Security Considerations

- **Non-secret env files** are isolated per application and contain no sensitive values
- **Secrets** never touch disk — fetched on demand via [scripts/with-secrets.sh](../scripts/with-secrets.sh) + secret-store CLI (local) or injected by the pipeline (CI)
- **Build context** is minimized using Turbo prune
- **Production images** don't include development dependencies
- **Base images** are regularly updated for security patches

### Performance Optimization

- **Layer caching** is optimized for common change patterns
- **Build context** is minimized to reduce upload time
- **Multi-stage builds** keep final images small
- **Dependency caching** reduces build times

## Troubleshooting

### Common Issues

1. **Build context too large** - Ensure `.dockerignore` is properly configured
2. **Environment variables not loading** - Check file paths in docker-compose.yml
3. **Port conflicts** - Ensure each service uses unique ports
4. **Cache issues** - Use `--no-cache` flag to force rebuild

### Debugging Commands

```bash
# Check build context size
docker build --progress=plain --no-cache .

# Inspect final image
docker run -it --entrypoint /bin/sh image-name

# Check environment variables
docker exec container-name env
```

This Docker setup provides a robust foundation for containerized development and deployment while maintaining the flexibility and independence that makes monorepos successful.
