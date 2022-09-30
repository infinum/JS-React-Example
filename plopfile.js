const projectStructure = require('./scripts/plop-react-project-structure');

/**
 * @param {import("plop").NodePlopAPI} plop
 */
module.exports = function main(plop) {
	projectStructure(plop);
};
