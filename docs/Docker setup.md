# Docker Setup

This document explains the Docker setup and containerization strategy for the monorepo.

## Overview

The repository uses a Docker setup that emphasizes application independence while leveraging monorepo benefits. Each application can be built and deployed independently, yet shares common infrastructure and tooling.

## Individual Dockerfiles per Application

### Why Each App Has Its Own Dockerfile

Each application in the monorepo maintains its own Dockerfile in its respective directory:

```
apps/
├── web/
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
FROM node:22.17.0-alpine AS base

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
RUN pnpm dlx turbo@2.4.2 prune @infinum/web --docker
```

This creates a minimal subset of the monorepo containing only the files needed for the specific application, significantly reducing build time and image size.

## Environment Variables Strategy

### App-Level Environment Files

Each application maintains its environment variables within its own directory:

```
apps/
├── web/
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

### Docker Compose Integration

The `docker-compose.yml` references each application's environment file:

```yaml
services:
  web:
    env_file:
      - ../apps/web/.env.compose
  storybook:
    # No env_file needed for storybook in this example
```

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
  web:
    container_name: infinum-react-example-web
    image: infinum-react-example-web
    restart: unless-stopped
    build:
      context: ..              # Build from repository root
      dockerfile: ./apps/web/Dockerfile
      target: production       # Use production stage
    ports:
      - '3000:3000'
    environment:
      - HOSTNAME=0.0.0.0      # Next.js specific
    env_file:
      - ../apps/web/.env.compose
```

## Docker Scripts and Usage

### Production Script

The root `package.json` includes a convenient Docker script:

```json
{
  "scripts": {
    "docker:prod": "docker compose -f ./docker/docker-compose.yml"
  }
}
```

### Flexible Usage Patterns

This script can be used in multiple ways:

```bash
# Start all services
pnpm docker:prod up --build

# Start specific service
pnpm docker:prod up web --build

# Start in detached mode
pnpm docker:prod up -d

# View logs
pnpm docker:prod logs -f web

# Stop all services
pnpm docker:prod down

# Rebuild specific service
pnpm docker:prod build web
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

### Next.js Applications (Web)

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

1. **Create Dockerfile** in the app directory following the established pattern
2. **Add environment files** (`.env.local` and `.env.compose`)
3. **Update docker-compose.yml** with the new service
4. **Test independence** - ensure the app works without monorepo dependencies

### Security Considerations

- **Environment variables** are properly isolated per application
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
