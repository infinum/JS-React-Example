#!/usr/bin/env bash

set -o errexit
set -o pipefail
set -o nounset
# set -o xtrace

function main() {
	if [ $# -ne 1 ]; then
		echo "Usage: $0 ENVIRONMENT"
		exit
	fi

	last_commit=$(git rev-parse HEAD)
	environment=$1

	gem install mina-infinum
	mina ${environment} ssh_keyscan_domain
	mina "${environment}" deploy commit="${last_commit}"
}

main "$@"
