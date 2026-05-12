#!/usr/bin/env bash
# Root-level compose driver.
#
# Wraps `docker compose -f docker/docker-compose.yml` with one `with-secrets.sh`
# layer per app under apps/. Each layer injects that app's secrets (resolved
# from its provider manifest) into the parent process; compose's per-service
# `environment:` blocks then forward only what each container asks for.
#
# Apps are discovered by globbing apps/*/, not by name — adding a new app is a
# zero-edit operation here. Apps without a secrets manifest fall through
# inside with-secrets.sh, so wrapping them is cheap (one extra exec, no
# provider work).
#
# Usage:
#   scripts/compose.sh up -d
#   scripts/compose.sh up frontend
#   scripts/compose.sh logs -f
#   scripts/compose.sh down

set -euo pipefail

repo_root="$(cd "$(dirname "$0")/.." && pwd)"
cmd=(docker compose -f "$repo_root/docker/docker-compose.yml" "$@")

# Sort for stable ordering (purely cosmetic — secret namespaces are disjoint
# per app, so layer order doesn't affect resolved values).
for app_dir in $(printf '%s\n' "$repo_root"/apps/*/ | sort); do
	[[ -d "$app_dir" ]] || continue
	cmd=("$repo_root/scripts/with-secrets.sh" "$app_dir" -- "${cmd[@]}")
done

exec "${cmd[@]}"
