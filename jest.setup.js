// Optional: configure or set up a testing framework before each test.
// If you delete this file, remove `setupFilesAfterEnv` from `jest.config.js`

// Used for __tests__/testing-library.js
// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom/extend-expect';
import 'jest-axe/extend-expect';
import { server } from './.msw/server';
import { factory } from './factory.setup';
// import { config } from '@datx/jsonapi';

// config.fetchReference = globalThis.fetch;

// Establish API mocking before all tests.
beforeAll(() => server.listen());
// Reset any request handlers that we may add during the tests,
// so they don't affect other tests.
afterEach(() => {
	factory.reset();
	server.resetHandlers();
});
// Clean up after the tests are finished.
afterAll(() => server.close());
