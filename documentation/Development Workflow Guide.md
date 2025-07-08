# Development Workflow Guide

## Overview

This guide covers the complete development workflow from feature conception to production deployment, including Git workflows, code review processes, quality assurance, and release management.

## Git Workflow

### Branch Strategy

**Main Branches:**

- **`main`**: Production-ready code, always deployable
- **`develop`**: Integration branch for ongoing development (optional)

**Feature Branches:**

- **`feature/PROJ-123-feature-name`**: New features
- **`bugfix/PROJ-456-issue-description`**: Bug fixes
- **`hotfix/PROJ-789-critical-fix`**: Critical production fixes
- **`chore/PROJ-012-maintenance-task`**: Maintenance and tooling updates

**Branch Naming:**

```bash
# Include JIRA/Productive ticket numbers
feature/PROJ-123-user-authentication
feature/PROJ-456-dashboard-redesign
bugfix/PROJ-789-login-validation-error
hotfix/PROJ-012-security-vulnerability
chore/PROJ-345-update-dependencies
```

### Commit Message Standards

**Format:** `<type>(scope): <description>` written in **impersonal form**

**Commit Types:**

- **`feat`**: New feature
- **`fix`**: Bug fix
- **`docs`**: Documentation changes
- **`refactor`**: Code refactoring
- **`test`**: Adding or modifying tests
- **`chore`**: Maintenance tasks

**Examples (Impersonal Form):**

```bash
feat(auth): add OAuth2 login integration

fix(ui): resolve button color contrast issue in dark mode

docs(api): update authentication endpoint documentation

refactor(utils): extract common validation logic

test(auth): add unit tests for login validation

chore(deps): update Next.js to version 15.1.7
```

### Daily Development Workflow

**1. Start New Work:**

```bash
git checkout main && git pull origin main
git checkout -b feature/PROJ-123-your-feature-name
pnpm install && pnpm build
```

**2. Development Loop:**

```bash
pnpm dev
# Make changes, commit frequently with ticket numbers
git commit -m "feat(scope): implement initial feature structure"
```

**3. Prepare for Review:**

```bash
git fetch origin && git rebase origin/main
git push origin feature/PROJ-123-your-feature-name
```

## Code Review Process

**Review Focus Areas:**

- Business logic correctness and edge cases
- Security considerations and performance implications
- Code quality, readability, and maintainability
- Test coverage and documentation updates

**Review Checklist:**

- \[ ] Code follows established patterns and conventions
- \[ ] Security and performance considerations addressed
- \[ ] Tests are comprehensive and meaningful
- \[ ] Documentation updated where necessary

## Release Management

### Changesets Workflow

**Manual Changeset Creation:**

You should commit changesets together with the changes you want to describe with them, but if you forgot then it's fine to add them later.

```bash
# After making changes, add changeset
pnpm changeset
# 1. Select changed packages
# 2. Choose version bump (patch/minor/major)
# 3. Write summary in past tense for users

git add .changeset/ && git commit -m "chore: add changeset"
```

**Changeset Summary Guidelines:**

- Write in **past tense** for end users
- Describe what changed, not how it was implemented

**Examples:**

```markdown
# Good (past tense, user-focused)
"Added new button variants for improved accessibility"
"Fixed login validation error on mobile devices"
"Updated authentication flow to support SSO"

# Bad (present tense, technical)
"Add button variants"
"Fix validation bug"
"Implement SSO support"
```

### Automated Release with GitHub Actions

**Changesets Bot Integration:**
The repository uses the Changesets GitHub Actions bot that automatically:

1. **Monitors PRs**: Checks if changesets are included with code changes
2. **Creates Release PRs**: Automatically opens PRs with version bumps and changelog updates
3. **Publishes Releases**: Triggers releases when release PRs are merged
4. **Updates Changelogs**: Generates user-facing changelogs in past tense

**Bot Configuration Benefits:**

- Eliminates manual version management
- Ensures consistent release process
- Automatically generates comprehensive changelogs
- Integrates with GitHub releases and tags

**Manual Override (when needed):**

```bash
# Emergency release process
pnpm dlx changeset version
git commit -m "release: version packages"
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin main --tags
```

### Version Management

**Semantic Versioning:**

- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes (backward compatible)

## Documentation Standards

### Code Documentation

```typescript
/**
 * Validates user registration input against business rules
 *
 * @param input - User registration data
 * @returns Validation result with detailed error messages
 * @see PROJ-123 for complete validation requirements
 */
```

### Architectural Decision Records (ADRs)

**What are ADRs:**
Architectural Decision Records are lightweight documentation capturing important architectural and technical decisions made during development. They provide historical context, rationale, and consequences of significant choices that affect the codebase.

**When to Create ADRs:**

- Major technology choices (frameworks, libraries, databases)
- Architectural patterns and design decisions
- Significant refactoring approaches
- Security or performance-related decisions
- Controversial decisions requiring team alignment
- Breaking changes or migration strategies

**ADR Structure:**

```markdown
# ADR-[number]: [Decision Title]

## Status
[Proposed | Accepted | Deprecated | Superseded]

## Context
What is the issue that we're seeing that is motivating this decision or change?

## Decision
What is the change that we're proposing or have agreed to implement?

## Alternatives Considered
What other options did we look at?

## Consequences
What becomes easier or more difficult to do and any risks introduced?

## Implementation Notes
Any specific implementation details or migration steps (optional)
```

**Best Practices:**

- **Keep it concise**: 1-2 pages maximum
- **Use present tense** for status and decisions
- **Be specific**: Include concrete examples and code snippets
- **Update status**: Mark as deprecated/superseded when decisions change
- **Link to tickets**: Reference relevant JIRA/Productive tickets
- **Review regularly**: Revisit ADRs during retrospectives

**Examples:**

```markdown
# ADR-001: Use React Query for Data Fetching

## Status
Accepted

## Context
The frontend application needs robust data fetching with caching, background updates,
and optimistic updates. Current fetch implementation lacks error handling and caching,
leading to poor user experience and unnecessary API calls.

## Decision
We will use TanStack Query (React Query) v5 for all API interactions in the frontend.

## Alternatives Considered
- **SWR**: Good caching but less mature ecosystem
- **Apollo Client**: Overkill for REST APIs, GraphQL-focused
- **Custom solution**: Too much maintenance overhead
- **Native fetch with manual caching**: Error-prone and time-consuming

## Consequences
- ✅ Automatic caching and background synchronization
- ✅ Built-in error handling and retry logic
- ✅ Optimistic updates and mutation management
- ✅ DevTools for debugging
- ❌ Additional 50KB bundle size
- ❌ Learning curve for team members
- ❌ Another dependency to maintain

## Implementation Notes
- Configure with 5-minute stale time for most queries
- Use mutation hooks for all data modifications
- Implement error boundaries for query failures
- See PROJ-456 for implementation timeline
```

```markdown
# ADR-002: Adopt Monorepo Structure with pnpm Workspaces

## Status
Accepted

## Context
The project consists of multiple related applications (frontend, storybook) and
shared packages (UI components, configs). Managing separate repositories leads
to versioning challenges and difficult code sharing.

## Decision
Implement a monorepo structure using pnpm workspaces with Turborepo for build optimization.

## Alternatives Considered
- **Separate repositories**: Version management nightmare
- **npm workspaces**: Slower than pnpm, less efficient
- **Yarn workspaces**: pnpm has better performance and disk usage
- **Lerna**: Additional complexity, pnpm workspaces sufficient

## Consequences
- ✅ Simplified dependency management
- ✅ Atomic commits across packages
- ✅ Faster builds with Turborepo caching
- ✅ Easier code sharing and refactoring
- ❌ Larger repository size
- ❌ More complex CI/CD pipeline
- ❌ Potential for tighter coupling

## Implementation Notes
- Use `packages/` for shared libraries
- Use `apps/` for deployable applications
- Configure Turborepo for optimal caching
- See PROJ-789 for migration steps
```

**ADR File Organization:**

- Store in `/docs/adrs/` directory
- Use numbered format: `001-decision-title.md`
- Link from main documentation index
- Include in code review process for architectural changes
