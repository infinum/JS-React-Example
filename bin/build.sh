#!/usr/bin/env bash

set -o errexit
set -o pipefail
set -o nounset
# set -o xtrace

function main() {
	# bundle install
	npm install

	gem install secrets_cli
	secrets pull -e staging -y

	# npm run lint
	npm run test
	npm run build
}

main "$@"
