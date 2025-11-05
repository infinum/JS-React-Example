# Infinum - React Example

A modern React monorepo showcasing Next.js 15, TypeScript, and best practices for enterprise development. Features internationalization, authentication, theming, and a comprehensive design system.

## Quick Start

### Prerequisites

- **Node.js**: Version specified in `package.json`
- **pnpm**: Version specified in `package.json`
- **Corepack**: Run `corepack enable` to manage package manager versions automatically
- **Docker**: For containerized development (optional but recommended)

### One-Command Setup

```bash
# Clone, install, and start development
git clone <repository-url>
cd JS-React-Example
pnpm install && pnpm dev
```

**Access the applications:**

- **Frontend**: http://localhost:3000
- **Storybook**: http://localhost:6006

### Authentication

The application uses NextAuth.js with multiple providers:

- **Development**: Uses mock authentication - any email/password combination works
- **Production**: Configure OAuth providers (Google, GitHub) via environment variables

No additional setup required for local development - authentication is pre-configured for immediate use.

## Architecture Overview

This monorepo leverages Next.js 15's App Router with modern React patterns. The frontend uses Server Components for optimal performance, Route Handlers for API endpoints, and Edge Runtime middleware for authentication. Internationalization runs at the routing level with locale-aware navigation, while the design system provides consistent theming across light/dark modes. The component library uses composition patterns with CVA variants, enabling rapid UI development with type safety throughout.

## Project Structure

```
apps/
├── frontend/          # Next.js application (main app)
└── storybook/         # Component documentation

packages/
├── ui/                # Shared React components
└── configs/           # ESLint/Prettier configurations

documentation/         # Comprehensive guides
docker/               # Production Docker setup
scripts/              # Automation and tooling
```

**Detailed structure**: See [Monorepo Structure Guide](documentation/Monorepo%20Structure.md)

## Technology Stack

### Core Technologies

- **Next.js 15**: React framework with App Router and React 19
- **TypeScript 5.7**: Type safety and enhanced developer experience
- **Tailwind CSS 4**: Utility-first styling with design tokens
- **pnpm + Turborepo**: Efficient monorepo management and build optimization

### Key Features

- **Authentication**: NextAuth.js with multiple OAuth providers
- **Internationalization**: next-intl with 3 languages (EN, PL, HR)
- **Theming**: Dark/light mode with next-themes
- **Components**: shadcn/ui with custom design system
- **Testing**: Jest + React Testing Library + Playwright

### Development Tools

- **Storybook**: Component development and documentation
- **ESLint 9 + Prettier**: Code quality and formatting
- **Husky**: Git hooks for quality gates
- **Docker**: Containerized development and deployment

## API Documentation

The application uses Next.js Route Handlers for API endpoints:

- **Authentication endpoints**: `/api/auth/*` (NextAuth.js)
- **API routes**: Located in `apps/frontend/src/app/api/`
- **Type-safe APIs**: Full TypeScript integration with Zod validation

API patterns and development guide: [API Development Guide](documentation/API%20Development%20Guide.md) *(coming soon)*

## Third-Party Services

### Development

- **Authentication**: NextAuth.js (supports Google, GitHub, SAML, credentials)
- **Styling**: Tailwind CSS with shadcn/ui components
- **Icons**: Radix UI icons and Lucide React

## App Specifics

### Internationalization

- **Languages**: English (default), Polish, Croatian
- **Routing**: Locale-based URLs (`/en/`, `/pl/`, `/hr/`)
- **Management**: JSON-based translations with TypeScript declarations
- **Server Rendering**: Full SSR support with locale detection

**Detailed setup**: [Internationalization Guide](documentation/Internationalization%20Guide.md)

### Accessibility

- **Standards**: WCAG 2.1 AA compliance target
- **Components**: Built-in a11y with Radix UI primitives
- **Testing**: Jest-axe integration for automated accessibility testing
- **Focus Management**: Proper keyboard navigation and focus indicators

### Performance

- **Core Web Vitals**: Optimized for LCP, FID, CLS
- **Image Optimization**: Next.js Image component with responsive loading
- **Code Splitting**: Automatic route-based and component-based splitting
- **Caching**: Sophisticated caching strategies for API and static content

## Environment Management

### Local Development

### Key Variables

- **`NEXTAUTH_SECRET`**: Authentication secret (auto-generated in dev)
- **`NEXTAUTH_URL`**: Application URL for OAuth callbacks
- **OAuth providers**: `GOOGLE_CLIENT_ID`, `GITHUB_CLIENT_ID`, etc.

### Environment Files

- **`.env.local`**: Local development overrides
- **`.env.compose`**: Docker Compose environment

**Complete setup**: [Environment Variables Guide](documentation/Environment%20variables.md)

## Development Workflow

### Daily Development

```bash
# Start new feature with ticket number
git checkout -b feature/PROJ-123-feature-name

# Development with hot reload
pnpm dev

# Quality checks
pnpm pre-commit
```

### Code Quality

- **Pre-commit hooks**: Automatic linting and formatting
- **Conventional commits**: Standardized commit messages with ticket numbers
- **Type checking**: Full TypeScript validation across monorepo

### Testing Strategy

```bash
# Run all tests
pnpm test

# Component testing
pnpm --filter @infinum/ui test

# E2E testing (when configured)
pnpm --filter frontend test:e2e
```

**Detailed workflow**: [Development Workflow Guide](documentation/Development%20Workflow%20Guide.md)

## Git Branching Strategy

### Branch Types

- **`feature/PROJ-123-description`**: New features with JIRA/Productive ticket numbers
- **`bugfix/PROJ-456-description`**: Bug fixes
- **`hotfix/PROJ-789-description`**: Critical production fixes
- **`chore/PROJ-012-description`**: Maintenance and tooling

### Workflow Philosophy

We use a simplified Git Flow focused on rapid iteration and continuous deployment:

1. **Feature branches** from `main` with descriptive names and ticket numbers
2. **Pull requests** with automated quality checks and code review
3. **Squash merging** to maintain clean history
4. **Automated releases** using Changesets for version management

This model works for our team because it maintains code quality while enabling fast iteration and clear traceability to project tickets.

**Complete branching guide**: [Development Workflow Guide](documentation/Development%20Workflow%20Guide.md#git-workflow)

## Contributing

### Quick Start

1. **Create feature branch**: `git checkout -b feature/PROJ-123-your-feature`
2. **Make changes**: Follow existing patterns and conventions
3. **Quality checks**: `pnpm lint && pnpm test`
4. **Create PR**: Include ticket number and clear description
5. **Code review**: Address feedback and ensure CI passes

### Code Standards

- **TypeScript**: Strict mode enabled, no `any` types
- **React**: Functional components with hooks
- **Styling**: Tailwind CSS with design system tokens
- **Testing**: Unit tests for components, integration tests for features

### Component Development

New UI components should:

- Use CVA for variant management
- Include Storybook stories
- Have comprehensive unit tests
- Follow accessibility best practices
- Include TypeScript declarations

**Detailed contribution guidelines**: [Development Workflow Guide](documentation/Development%20Workflow%20Guide.md#collaboration-practices)

## Documentation

### Available Guides

- [Monorepo Structure](documentation/Monorepo%20Structure.md) - Project organization and architecture
- [Development Workflow](documentation/Development%20Workflow%20Guide.md) - Git workflow, code review, releases
- [UI Components](documentation/UI%20Components%20Guide.md) - ShadCN component generation and customization
- [Semantic Tokens](documentation/Semantic%20Tokens%20Guide.md) - Design tokens and theming system
- [Internationalization](documentation/Internationalization%20Guide.md) - next-intl setup and configuration
- [Environment Variables](documentation/Environment%20variables.md) - Complete environment setup
- [Docker Setup](documentation/Docker%20setup.md) - Containerized development and deployment

### Architecture Decisions

Technical decisions are documented in [Architecture Decision Records](documentation/decision-record/) following the ADR format for traceability and team alignment.

## Docker Development

### Production Build

```bash
# Build and run production containers
pnpm docker:prod build
pnpm docker:prod up -d

# Access applications
# Frontend: http://localhost:3000
# Storybook: http://localhost:6006
```

**Complete Docker guide**: [Docker Setup](documentation/Docker%20setup.md)

## pnpm Config

- `minimumReleaseAge` - Only install package versions that are at least X minutes old (helps avoid fresh compromised releases).
- `onlyBuiltDependencies` - Only run build/postinstall scripts for this allowlist of dependencies. This reduces the overall attack surface, but scripts for these packages will still run if a compromised version is installed.
- `strictPeerDependencies` - If this is enabled, commands will fail if there is a missing or invalid peer dependency in the tree.
- `peerDependencyRules.allowedVersions` - Allow next-runtime-env to run with Next 15 + React 19. Library declares peer deps for Next 14 / React 18, but works fine with newer versions.
- `strictDepBuilds` - When strictDepBuilds is enabled, the installation will exit with a non-zero exit code if any dependencies have unreviewed build scripts (aka postinstall scripts).
- `engineStrict` - If this is enabled, pnpm will not install any package that claims to not be compatible with the current Node version.
- `catalog` - Catalogs can be used for defining dependency version ranges as reusable constants. Constants defined in catalogs can later be referenced in package.json files.

## Credits

JS-React-Example is maintained by
[Infinum](https://www.infinum.com).

<p align="center">
  <a href='https://infinum.com'>
    <picture>
        <source srcset="https://assets.infinum.com/brand/logo/static/white.svg" media="(prefers-color-scheme: dark)">
        <img src="https://assets.infinum.com/brand/logo/static/default.svg">
    </picture>
  </a>
</p>
