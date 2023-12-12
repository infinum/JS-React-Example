// Optional: configure or set up a testing framework before each test.
// If you delete this file, remove `setupFilesAfterEnv` from `jest.config.js`

// Used for __tests__/testing-library.js
// Learn more: https://github.com/testing-library/jest-dom
import { server } from '@/mocks/server';
import '@testing-library/jest-dom';
import 'jest-axe/extend-expect';

// eslint-disable-next-line @typescript-eslint/no-unsafe-return
jest.mock('next/router', () => require('next-router-mock'));

// In order to run `jest-axe` assertions for components containing
// `next/link`, we need `IntersectionObserver` to always exist,
// but to be mocked so that we can set it to *never* intersect
import 'react-intersection-observer/test-utils';

global.IntersectionObserver = jest.fn();

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
