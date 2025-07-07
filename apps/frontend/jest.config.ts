import baseConfig from '@infinum/configs/jest';
import type { Config } from 'jest';
import nextJest from 'next/jest.js';

const createJestConfig = nextJest({
	dir: './',
});

const config: Config = {
	...baseConfig,
	coverageProvider: 'v8',
	coverageDirectory: '../../coverage/frontend',
	testEnvironment: 'jsdom',
	setupFilesAfterEnv: ['<rootDir>/src/tests/jest.setup.ts'],
	extensionsToTreatAsEsm: ['.ts', '.tsx'],
	moduleNameMapper: {
		'^@/(.*)$': '<rootDir>/src/$1',
		'^@infinum/ui/(.*)$': '<rootDir>/../../packages/ui/src/$1',
	},
};

export default async () => ({
	...(await createJestConfig(config)()),
	// https://github.com/vercel/next.js/issues/40183
	transformIgnorePatterns: ['node_modules/(?!next-intl)/'],
});
