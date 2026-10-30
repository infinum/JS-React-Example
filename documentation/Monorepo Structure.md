# Monorepo Structure

## TL;DR

This monorepo uses a well-organized structure that separates concerns while enabling code sharing:

- **`apps/`** - Independent applications (frontend, storybook)
- **`packages/`** - Shared code libraries (ui, configs)
- **`scripts/`** - Automation and utility scripts
- **`docker/`** - Deployment and infrastructure configuration
- **`.github/`** - CI/CD workflows and GitHub configuration
- **`documentation/`** - Comprehensive project documentation

## Scripts Directory (`scripts/`)

Automation and utility scripts for development and maintenance.

```
scripts/
├── aggregate-coverage-results.js   # Combines per-package coverage for CI
├── aggregate-license-results.js    # License compliance reporting
├── bootstrap.sh                    # Project setup automation
├── check-licenses-workspace.js     # License compliance checking
├── comment-coverage-diff.js        # Coverage comment on pull requests
├── create-env-overrides.sh         # Environment variable setup
├── install-test-browsers.sh        # Chromium for Vitest browser tests
├── lint-staged-commands.js         # Pre-commit commands per workspace package
├── test-affected.sh                # Runs only the tests affected by the branch
├── test-coverage-changed.sh        # Coverage of the files changed on the branch
└── verify.sh                       # Every check, for the Stop hook, pre-push and `pnpm verify`
```

## Tests

Each workspace with tests has its own `vitest.config.mts`, built on the shared `@infinum/configs/vitest` config. Turbo runs them per package.

| Workspace        | Environment             | Tests                         | Coverage             |
| ---------------- | ----------------------- | ----------------------------- | -------------------- |
| `apps/frontend`  | jsdom (Node.js)         | `*.test.ts(x)`, `__tests__/`  | `coverage/frontend`  |
| `apps/frontend`  | Node.js (integration)   | `*.integration.test.ts`       | `coverage/frontend`  |
| `packages/ui`    | Chromium (browser mode) | `__tests__/`                  | `coverage/ui`        |
| `apps/storybook` | Chromium (browser mode) | every story in `__stories__/` | `coverage/storybook` |

See the [Testing Guide](Testing%20Guide.md).

## Docker Configuration (`docker/`)

Centralized deployment configuration.

```
docker/
└── docker-compose.yml              # Multi-service orchestration
```

## GitHub Configuration (`.github/`)

CI/CD workflows and GitHub-specific configuration.

```
.github/
├── actions/                        # Custom GitHub Actions
├── workflows/                      # GitHub Actions workflows
│   └── code-analysis.yml          # Code quality workflow
├── CODEOWNERS                      # Code ownership rules
└── pull_request_template.md        # PR template
```

## VS Code Configuration (`.vscode/`)

Workspace settings for consistent development experience.

```
.vscode/
├── extensions.json                 # Recommended extensions
├── launch.json                     # Debug configurations
├── settings.json                   # Workspace settings
└── tasks.json                      # Task definitions
```
