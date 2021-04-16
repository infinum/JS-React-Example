#!/usr/bin/env bash

set -o errexit
set -o pipefail
set -o nounset
# set -o xtrace

function main() {
	if [ ! -d "$SEMAPHORE_CACHE_DIR/.next/cache/" ]; then
		mkdir -p "$SEMAPHORE_CACHE_DIR/.next/cache/"
	fi
	mkdir -p "$SEMAPHORE_PROJECT_DIR/.next/"
	ln -s "$SEMAPHORE_CACHE_DIR/.next/cache/" "$SEMAPHORE_PROJECT_DIR/.next/cache"

	# bundle install
	npm ci

	gem install secrets_cli
	secrets pull -e staging -y

	# npm run lint
	npm run test
	npm run build
}

main "$@"
