#!/usr/bin/env bash
# Fails when a workflow's Playwright image doesn't match the Playwright version in the pnpm catalog.
# Screenshots must be rendered by the same Playwright in CI and in the sandbox, so both move together.
set -euo pipefail

root="$(git rev-parse --show-toplevel)"
cd "$root"

# Reads a package's version from the default `catalog:` block in pnpm-workspace.yaml
catalog_version() {
	awk -v pkg="$1" '
		/^catalog:/ { in_catalog = 1; next }
		/^[^[:space:]#]/ { in_catalog = 0 }
		in_catalog {
			line = $0
			gsub(/["\047]/, "", line)
			if (match(line, "^[[:space:]]+" pkg ":[[:space:]]*")) { print substr(line, RLENGTH + 1); exit }
		}
	' pnpm-workspace.yaml
}

test_version="$(catalog_version '@playwright/test')"
core_version="$(catalog_version 'playwright')"

if [ -z "$test_version" ] || [ -z "$core_version" ]; then
	echo "❌ Couldn't read @playwright/test and playwright from the catalog in pnpm-workspace.yaml" >&2
	exit 1
fi
if [ "$test_version" != "$core_version" ]; then
	echo "❌ The catalog pins @playwright/test $test_version but playwright $core_version. Pin both to the same version." >&2
	exit 1
fi

images="$(grep -HnoE 'mcr\.microsoft\.com/playwright:v[^[:space:]"]+' .github/workflows/*.yml || true)"
if [ -z "$images" ]; then
	echo "❌ No mcr.microsoft.com/playwright image found in .github/workflows/" >&2
	exit 1
fi

status=0
while IFS= read -r match; do
	location="${match%%:mcr*}"
	tag="${match##*:v}"
	image_version="${tag%%-*}"
	if [ "$image_version" = "$test_version" ]; then
		echo "✅ $location uses Playwright $image_version"
	else
		echo "❌ $location uses Playwright $image_version, but the catalog pins $test_version." >&2
		echo "   Update the image to mcr.microsoft.com/playwright:v$test_version-${tag#*-}" >&2
		status=1
	fi
done <<< "$images"

exit "$status"
