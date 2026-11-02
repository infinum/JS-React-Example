#!/usr/bin/env bash
# Prints coverage for the files changed since the branch split from origin/main, in the packages they belong to.
# Report only: package thresholds don't apply to this subset.
set -euo pipefail

base="$(git merge-base HEAD origin/main 2> /dev/null || true)"

if [ -z "$base" ]; then
	echo "⚠️  Could not determine the merge-base with origin/main, comparing with origin/main"
	base="origin/main"
fi

echo "📊 Coverage of files changed since ${base:0:7}"
export TEST_CHANGED_BASE="$base" # read by each package's test:coverage:changed script
export TURBO_SCM_BASE="$base"    # read by turbo --affected
exec pnpm turbo run test:coverage:changed --affected --log-order=grouped --continue
