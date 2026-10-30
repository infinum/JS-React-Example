const { buildCommands } = require('./scripts/lint-staged-commands');

/**
 * @type {import('lint-staged').Configuration}
 */
module.exports = {
	'*': (stagedAbsPaths) => buildCommands(stagedAbsPaths),
};
