const nextJest = require('next/jest');
const { infinumJest } = require('@infinum/jest');

const createNextJestConfig = nextJest({
	// Provide the path to your Next.js app to load next.config.js and .env files in your test environment
	dir: './',
});

const createInfinumJestConfig = infinumJest();

// Add any custom config to be passed to Jest
/** @type {import('jest').Config} */
const customJestConfig = {
	setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
	moduleNameMapper: {
		// Handle module aliases (this will be automatically configured for you soon)
		'^@/(.*)$': '<rootDir>/src/$1',
		'^test-utils$': '<rootDir>/scripts/test-utils',
	},
	// if using TypeScript with a baseUrl set to the root directory then you need the below for alias' to work
	moduleDirectories: ['node_modules', '<rootDir>/'],
	testEnvironment: '@infinum/jest/environment',
	collectCoverageFrom: ['./src/**/*.{js,jsx,ts,tsx}'],
	watchPlugins: ['jest-watch-typeahead/filename', 'jest-watch-typeahead/testname'],
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createNextJestConfig(createInfinumJestConfig(customJestConfig));
