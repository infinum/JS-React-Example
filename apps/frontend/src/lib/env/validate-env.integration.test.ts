import { afterEach, describe, expect, it, vi } from 'vitest';
import { publicEnv } from './validate-env.client';
import { secretEnv } from './validate-env.server';

// The real package throws outside a React Server Components build
vi.mock('server-only', () => ({}));

// envsafe logs the report before throwing it
const silenceReport = () => vi.spyOn(console, 'error').mockImplementation(() => undefined);

afterEach(() => {
	vi.restoreAllMocks();
});

describe('environment validation', () => {
	describe('public env', () => {
		it('fills in defaults for local development', () => {
			vi.stubEnv('NODE_ENV', 'development');
			vi.stubEnv('NEXTAUTH_URL', undefined);
			vi.stubEnv('API_BASE_URL', undefined);

			expect(publicEnv()).toEqual({
				NODE_ENV: 'development',
				NEXTAUTH_URL: 'http://localhost:3000',
				API_BASE_URL: 'http://localhost:3000/api',
			});
		});

		it('rejects an unknown NODE_ENV', () => {
			silenceReport();
			vi.stubEnv('NODE_ENV', 'staging');

			expect(() => publicEnv()).toThrow(/NODE_ENV/);
		});
	});

	describe('secret env', () => {
		it('requires NEXTAUTH_SECRET in production', () => {
			silenceReport();
			vi.stubEnv('NODE_ENV', 'production');
			vi.stubEnv('NEXTAUTH_SECRET', undefined);

			expect(() => secretEnv()).toThrow(/NEXTAUTH_SECRET/);
		});

		it('uses a placeholder secret outside production', () => {
			vi.stubEnv('NODE_ENV', 'development');
			vi.stubEnv('NEXTAUTH_SECRET', undefined);

			expect(secretEnv().NEXTAUTH_SECRET).toBe('REPLACE_ME');
		});

		it('accepts a configured secret in production', () => {
			vi.stubEnv('NODE_ENV', 'production');
			vi.stubEnv('NEXTAUTH_SECRET', 'a-real-secret');

			expect(secretEnv().NEXTAUTH_SECRET).toBe('a-real-secret');
		});
	});
});
