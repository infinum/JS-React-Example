const projectStructure = require('./scripts/plop');

/**
 * @param {import("plop").NodePlopAPI} plop
 */
module.exports = function main(plop) {
	projectStructure(plop);
};
