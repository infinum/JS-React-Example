// Optional: configure or set up a testing framework before each test.
// If you delete this file, remove `setupFilesAfterEnv` from `jest.config.js`

// Used for __tests__/testing-library.js
// Learn more: https://github.com/testing-library/jest-dom
import { server } from '@/mocks/server';
import '@testing-library/jest-dom/extend-expect';
import 'jest-axe/extend-expect';

jest.mock('next/router', () => require('next-router-mock'));

// Establish API mocking before all tests.
beforeAll(() => {
	server.listen({
		onUnhandledRequest: 'error',
	});
});

// Reset any request handlers that we may add during the tests,
// so they don't affect other tests.
afterEach(() => {
	server.resetHandlers();
});

// Clean up after the tests are finished.
afterAll(() => {
	server.close();
});
