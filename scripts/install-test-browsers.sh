#!/bin/bash

# Installs the Chromium build that Vitest browser mode (packages/ui and Storybook story tests) needs.
# It's the same Playwright version as the E2E tests, so the browser download is shared.

if [ -n "${CI:-}" ]; then
	echo "   ⏭️  CI detected, browsers are installed by the workflow"
	exit 0
fi

if [ ! -x packages/ui/node_modules/.bin/playwright ]; then
	echo "   ⏭️  Playwright not installed, skipping test browsers"
	exit 0
fi

set -euo pipefail

echo "🧪 Ensuring Chromium for Vitest browser tests..."
# No-op when this Chromium version is already installed
pnpm --filter @infinum/ui exec playwright install chromium
