// This is a cjs file
/* eslint-disable @typescript-eslint/no-var-requires */

const init = require('@infinum/plop-next-ts-generators');

/**
 * @param {import("plop").NodePlopAPI} plop
 */
module.exports = function main(plop) {
	init(plop);
};
