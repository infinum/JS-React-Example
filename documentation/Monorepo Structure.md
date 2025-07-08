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
├── aggregate-license-results.js    # License compliance reporting
├── bootstrap.sh                    # Project setup automation
├── check-licenses-workspace.js     # License compliance checking
└── create-env-overrides.sh         # Environment variable setup
```

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
