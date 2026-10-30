#!/usr/bin/env bash
# Runs every repository check, so the Claude Stop hook, pre-push and `pnpm verify` share one definition.
#
#   agent  Stop hook. Lint, format, typecheck and tests of the packages changed on this branch.
#   push   pre-push. `agent` plus builds and the changeset check.
#   full   `pnpm verify`. Everything on every package, licenses and the audit included.
#
# Every step runs even when an earlier one fails, so one run reports all problems.
set -uo pipefail

mode="${1:-full}"
case "$mode" in
	agent | push | full) ;;
	*)
		echo "Usage: $0 [agent|push|full]" >&2
		exit 64
		;;
esac

# Compare against where the branch split from main, not HEAD, so committed work is still checked.
base="$(git merge-base HEAD origin/main 2> /dev/null || true)"
if [ -z "$base" ] && [ "$mode" = agent ]; then
	base="HEAD"
fi

failed=()

run() {
	local name="$1"
	shift
	echo "▶️  $name"
	if ! "$@"; then
		failed+=("$name")
	fi
}

tasks=(lint lint:root prettier:check prettier:check:root typecheck test test:root)
if [ "$mode" != agent ]; then
	tasks+=(build)
fi

turbo_args=(--continue --output-logs=errors-only)
if [ "$mode" != full ] && [ -n "$base" ]; then
	export TURBO_SCM_BASE="$base"
	turbo_args+=(--affected)
fi

run "Lint, format, typecheck and tests" pnpm turbo run "${tasks[@]}" "${turbo_args[@]}"
run "Unused files, exports and dependencies (knip)" pnpm knip

# Licenses and advisories only change with the lockfile. Includes uncommitted lockfile changes.
lockfile_changed=false
if [ "$mode" = full ] || [ -z "$base" ] || ! git diff --quiet "$base" -- pnpm-lock.yaml; then
	lockfile_changed=true
fi
if [ "$lockfile_changed" = true ]; then
	run "Dependency licenses" pnpm check-licenses
	run "Dependency vulnerabilities" pnpm audit --audit-level=high
fi

if [ "$mode" != agent ] && [ -n "$base" ]; then
	run "Changesets" pnpm changeset status --since="$base"
fi

if [ ${#failed[@]} -gt 0 ]; then
	echo "" >&2
	echo "❌ Failed checks:" >&2
	printf '   - %s\n' "${failed[@]}" >&2
	exit 1
fi

echo "✅ All checks passed"
