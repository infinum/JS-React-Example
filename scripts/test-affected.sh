#!/usr/bin/env bash
# Runs only the tests affected by the changes since the branch split from origin/main.
# Falls back to the full test suite when that can't be determined.
set -euo pipefail

base="$(git merge-base HEAD origin/main 2> /dev/null || true)"

if [ -z "$base" ]; then
	echo "⚠️  Could not determine the merge-base with origin/main, running the full test suite"
	exec pnpm test
fi

echo "🧪 Running tests affected by changes since ${base:0:7}"
export TEST_CHANGED_BASE="$base" # read by each package's test:changed script
export TURBO_SCM_BASE="$base"    # read by turbo --affected
exec pnpm turbo run test:changed --affected --parallel --log-order=grouped --continue
