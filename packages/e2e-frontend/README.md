# E2E Testing with Playwright

This package contains end-to-end tests for the frontend application using Playwright.

## Setup

The E2E tests are configured to run against your Next.js frontend application running on `http://localhost:3000`.

## Running Tests

### Locally

1. **Start the frontend application:**
   ```bash
   # From project root
   pnpm --filter @infinum/frontend dev
   ```

2. **Run E2E tests:**
   ```bash
   # From project root
   pnpm e2e

   # Or with different modes
   pnpm --filter e2e-frontend test:headed    # See browser window
   pnpm --filter e2e-frontend test:debug     # Step-by-step debugging
   pnpm --filter e2e-frontend test:ui        # Interactive UI mode
   ```

### In CI/CD

The tests automatically run in GitHub Actions on:
- Push to `main`/`master` branches
- Pull requests to `main`/`master` branches
- Manual workflow dispatch

## Test Structure

- **`home.spec.ts`** - Homepage functionality and visual regression
- **`login.spec.ts`** - Authentication flows
- **`home-axe.spec.ts`** - Accessibility testing
- **`multi-device.spec.ts`** - Responsive design testing
- **`pages/`** - Page Object Models for reusable page interactions
- **`utils/`** - Shared test utilities

## Configuration

- **Base config:** `../test-utils/base.playwright.config.ts`
- **Local config:** `playwright.config.ts`

## Key Features

### Visual Regression Testing
Screenshots are automatically captured and compared:
```bash
# Update snapshots when UI changes are intentional
pnpm --filter e2e-frontend test:update-snapshots
```

### Accessibility Testing
Uses `@axe-core/playwright` for automated a11y checks.

### Page Object Pattern
Reusable page objects in `pages/` directory for maintainable tests.

## Debugging

### Local Debugging
```bash
# Run with browser visible
pnpm --filter e2e-frontend test:headed

# Step through with Playwright Inspector
pnpm --filter e2e-frontend test:debug

# Interactive test runner
pnpm --filter e2e-frontend test:ui
```

### CI Debugging
- Playwright reports and videos are uploaded as artifacts
- Check the "Artifacts" section in failed GitHub Action runs
- Download and view the HTML report locally

## Environment Variables

The tests use these environment variables:
- `NEXTAUTH_SECRET` - Required for authentication
- `NODE_ENV=test` - Set automatically in CI
- `CI=true` - Enables CI-specific behavior

## Troubleshooting

### Common Issues

1. **Frontend not ready:** Increase timeout in CI if the app takes longer to start
2. **Flaky tests:** Check for race conditions, add proper waits
3. **Screenshot differences:** Update snapshots after intentional UI changes

### Useful Commands

```bash
# Show test report after running tests
pnpm --filter e2e-frontend test:report

# Run specific test file
pnpm exec playwright test home.spec.ts

# Run tests matching pattern
pnpm exec playwright test --grep "login"
```
