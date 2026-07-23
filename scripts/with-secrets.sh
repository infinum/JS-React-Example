#!/usr/bin/env bash
# Provider-agnostic secrets wrapper.
#
# Usage:
#   with-secrets.sh <app-dir> -- <command...>
#
# Resolves secrets for <app-dir> via whichever provider is configured, then
# execs <command> with the secrets in its environment. Supported providers are
# auto-detected from the manifest file present in <app-dir>; override with
# SECRETS_PROVIDER=op|doppler|infisical|chamber|none.
#
# In CI (or any environment where secrets are already in process.env) no
# manifest file is needed: the wrapper falls through to `exec "$@"` and the
# child process inherits whatever the runner exported.
#
# Each provider's invocation is intentionally `exec` so signals propagate
# cleanly to the child (important for long-running processes like
# `next dev` or `docker compose up`).

set -euo pipefail

if [[ $# -lt 1 ]]; then
	echo "usage: with-secrets.sh <app-dir> -- <cmd...>" >&2
	exit 64
fi

app_dir="$1"
shift
[[ "${1:-}" == "--" ]] && shift

if [[ ! -d "$app_dir" ]]; then
	echo "with-secrets: app dir '$app_dir' does not exist" >&2
	exit 66
fi

provider="${SECRETS_PROVIDER:-auto}"
provider_explicit=0
[[ -n "${SECRETS_PROVIDER:-}" ]] && provider_explicit=1

if [[ "$provider" == "auto" ]]; then
	if [[ -f "$app_dir/.env.secret" ]]; then
		if command -v op > /dev/null 2>&1; then
			provider=op
		else
			provider=none
		fi
	else
		provider=none
	fi
fi

# Warn whenever a manifest exists but no injection will happen — covers both
# auto-resolution failing to find a CLI AND a developer who has explicitly
# set SECRETS_PROVIDER=none in their environment. Apps without a manifest
# (e.g. storybook) stay silent — "no secrets" is their expected shape. CI
# stays silent — the pipeline's env: block populates secrets upstream.
if [[ "$provider" == "none" && -f "$app_dir/.env.secret" && -z "${CI:-}" ]]; then
	if [[ "$provider_explicit" == "1" ]]; then
		printf '\033[33m⚠\033[0m  with-secrets: %s has .env.secret but SECRETS_PROVIDER=none (explicit) — secrets NOT injected\n' "$app_dir" >&2
	else
		printf '\033[33m⚠\033[0m  with-secrets: %s has .env.secret but no provider CLI on PATH — secrets NOT injected\n' "$app_dir" >&2
	fi
fi

case "$provider" in
	op)
		[[ -z "${CI:-}" ]] && printf '\033[32m✓\033[0m  with-secrets: %s · op\n' "$app_dir" >&2
		exec op run --env-file="$app_dir/.env.secret" -- "$@"
		;;
	none) exec "$@" ;;
	*)
		echo "with-secrets: unknown SECRETS_PROVIDER='$provider'" >&2
		exit 78
		;;
esac
