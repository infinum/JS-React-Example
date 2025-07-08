/** @type {import('jest').Config} */
module.exports = {
	preset: 'ts-jest',
	testEnvironment: 'jsdom',
	moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
	testMatch: ['**/__tests__/**/*.(ts|tsx|js)', '**/*.(test|spec).(ts|tsx|js)'],
	collectCoverageFrom: [
		'src/**/*.{ts,tsx}',
		'!src/**/*.d.ts',
		'!src/**/*.test.{ts,tsx}',
		'!src/**/*.stories.{ts,tsx}',
		'!src/**/__tests__/**',
	],
	// This should be overridden by the package to:
	// '../../coverage/<package-name>'
	// to collect the coverage reports in the root of the project
	coverageDirectory: './coverage',
	coverageReporters: ['json', 'lcov', 'text', 'clover', 'html', 'json-summary'],
	transform: {
		'^.+\\.(ts|tsx)$': [
			'ts-jest',
			{
				tsconfig: '<rootDir>/tsconfig.json',
			},
		],
	},
	moduleNameMapper: {
		'\\.(css|less|scss|sass)$': '<rootDir>/src/tests/styleMock.js',
	},
	// Default coverage thresholds - can be overridden by individual packages
	coverageThreshold: {
		global: {
			branches: 7,
			functions: 7,
			lines: 7,
			statements: 7,
		},
	},
};
