#!/usr/bin/env bash
# Starts or reattaches to this repo's Docker Sandbox (private copy). Usage: pnpm sandbox [sbx env run flags...]
# Written for macOS's bash 3.2 too, so empty arrays are expanded with ${a[@]+"${a[@]}"}.
set -euo pipefail

root="$(git rev-parse --show-toplevel)"
dir="$root/docker/sandbox"
files=("$dir")
flags=()

command -v sbx > /dev/null || {
	echo "sbx is not installed: https://docs.docker.com/ai/sandboxes/install/" >&2
	exit 1
}

# The pinned org kit is refused unless its source is allowed (one-time, per developer)
sources="$(sbx settings get kit.allowedSources)"
[[ "$sources" == *"github.com/infinum/"* ]] || {
	echo "Allow the Infinum org kit once: sbx settings set kit.allowedSources '[\"docker.io/\",\"github.com/infinum/\"]'" >&2
	echo "(this replaces the list, currently $sources; keep any sources you already allow)" >&2
	exit 1
}

# The host's SSH agent must not reach the sandbox (global setting, needs a daemon restart)
[[ "$(sbx settings get ssh.agentForwardingEnabled)" == "false" ]] || {
	echo "Turn off SSH agent forwarding once: sbx settings set ssh.agentForwardingEnabled false && sbx daemon restart" >&2
	exit 1
}

# Private copy only: shared-folder mode would let the agent change files the host runs later
for arg in "$@"; do
	case "$arg" in
		--clone | --clone=*)
			echo "The sandbox always works on a private copy, so --clone can't be changed" >&2
			exit 1
			;;
	esac
done

if [[ -f "$dir/sbxenv.local.yaml" ]]; then
	if grep -qE '^(name|workspace):' "$dir/sbxenv.local.yaml"; then
		echo "docker/sandbox/sbxenv.local.yaml must not set name: or workspace:" >&2
		exit 1
	fi
	files+=("$dir/sbxenv.local.yaml")
fi
if [[ -f "$dir/sbxenv.local.args" ]]; then
	flags+=(--env-args-file "$dir/sbxenv.local.args")
fi

exec sbx env run ${flags[@]+"${flags[@]}"} "$@" "${files[@]}"
