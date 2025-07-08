const baseConfig = require('@infinum/configs/jest');

/** @type {import('jest').Config} */
module.exports = {
	...baseConfig,
	setupFilesAfterEnv: ['<rootDir>/src/tests/jest.setup.ts'],
	coverageDirectory: '../../coverage/ui',
	moduleNameMapper: {
		...baseConfig.moduleNameMapper,
		'^@infinum/ui/(.*)$': '<rootDir>/src/$1',
		'^@/(.*)$': '<rootDir>/src/$1',
	},
};
