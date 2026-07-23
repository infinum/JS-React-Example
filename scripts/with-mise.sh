#!/usr/bin/env bash
# Entry-point shim for root pnpm scripts.
#
# Runs the given command through `mise exec --` when mise is available
# (developer machines, ensures the pinned toolchain is used even from a
# non-activated shell). Falls through to plain exec when mise isn't on PATH
# (CI runners use actions/setup-node and don't install mise).
#
# Why not just always use `mise exec --` in package.json: that breaks CI,
# which provisions node via actions/setup-node reading package.json's
# engines.node and never installs mise.

set -euo pipefail

# Toolchain-state line so a contributor sees, on every root pnpm script,
# whether the pinned mise toolchain or the shell's ambient node/pnpm is
# about to run their command. The *absence* of the green check becomes the
# signal — silence here would let a misconfigured shell pass unnoticed.
# Silent in CI (actions/setup-node is the source of truth and decorative
# output muddies workflow logs).
if [[ -z "${CI:-}" ]]; then
	if command -v mise > /dev/null 2>&1; then
		versions="$(mise current 2> /dev/null | awk '{printf "%s@%s ", $1, $2}')"
		versions="${versions% }"
		printf '\033[32m✓\033[0m  toolchain: mise · %s\n' "${versions:-active}" >&2
	else
		printf '\033[33m⚠\033[0m  toolchain: mise not on PATH — using ambient node/pnpm\n' >&2
	fi
fi

if command -v mise > /dev/null 2>&1; then
	exec mise exec -- "$@"
else
	exec "$@"
fi
