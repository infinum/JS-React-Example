/**
 * @param {import("plop").NodePlopAPI} plop
 * @param {{ base?: string }} config
 */
module.exports = function projectStructure(plop, config) {
	const base = config?.base || './src';

	plop.setGenerator('theme', require('./generators/theme')(config));
	plop.setGenerator('component', require('./generators/component')(config));
};
