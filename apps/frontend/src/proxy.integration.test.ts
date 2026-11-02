import { NextRequest } from 'next/server';
import { describe, expect, it, vi } from 'vitest';
import proxy, { config } from './proxy';

const request = (path: string, headers: Record<string, string> = {}) =>
	new NextRequest(new URL(path, 'http://localhost:3000'), { headers });

// The public env is read once, when the module loads, so each environment needs a fresh import
const loadProxy = async (nodeEnv: 'development' | 'production') => {
	vi.stubEnv('NODE_ENV', nodeEnv);
	vi.resetModules();
	return (await import('./proxy')).default;
};

const nonceFrom = (csp: string | null) => csp?.match(/'nonce-([^']+)'/)?.[1];

describe('proxy', () => {
	describe('Content Security Policy', () => {
		it('enforces the policy outside development', async () => {
			const productionProxy = await loadProxy('production');

			const response = productionProxy(request('/en'));
			const csp = response.headers.get('content-security-policy');

			expect(csp).toContain("default-src 'self'");
			expect(csp).toContain("frame-ancestors 'none'");
			expect(csp).toContain('upgrade-insecure-requests');
			expect(csp).not.toContain("'unsafe-eval'");
			expect(response.headers.get('content-security-policy-report-only')).toBeNull();
		});

		it('only reports violations in development', async () => {
			const developmentProxy = await loadProxy('development');

			const response = developmentProxy(request('/en'));
			const csp = response.headers.get('content-security-policy-report-only');

			expect(csp).toContain("'unsafe-eval'");
			expect(csp).not.toContain('upgrade-insecure-requests');
			expect(response.headers.get('content-security-policy')).toBeNull();
		});

		it('passes the script nonce to the app through the x-nonce request header', () => {
			const response = proxy(request('/en'));

			const nonce = nonceFrom(response.headers.get('content-security-policy'));

			expect(nonce).toBeTruthy();
			expect(response.headers.get('x-middleware-request-x-nonce')).toBe(nonce);
		});

		it('generates a new nonce for every request', () => {
			const first = nonceFrom(proxy(request('/en')).headers.get('content-security-policy'));
			const second = nonceFrom(proxy(request('/en')).headers.get('content-security-policy'));

			expect(first).not.toBe(second);
		});
	});

	describe('locale routing', () => {
		it('redirects the root to the default locale', () => {
			const response = proxy(request('/'));

			expect(response.status).toBe(307);
			expect(response.headers.get('location')).toBe('http://localhost:3000/en');
		});

		it("redirects the root to the browser's preferred locale", () => {
			const response = proxy(request('/', { 'accept-language': 'pl' }));

			expect(response.headers.get('location')).toBe('http://localhost:3000/pl');
		});

		it('rewrites a localized pathname to its route', () => {
			const response = proxy(request('/pl/przyklad'));

			expect(response.headers.get('x-middleware-rewrite')).toBe('http://localhost:3000/pl/example');
		});
	});

	describe('matcher', () => {
		const [{ source }] = config.matcher;
		const matches = (path: string) => new RegExp(`^${source}$`).test(path);

		it('runs on pages', () => {
			expect(matches('/')).toBe(true);
			expect(matches('/pl/przyklad')).toBe(true);
		});

		it('skips API routes, Next.js internals and static assets', () => {
			expect(matches('/api/auth/session')).toBe(false);
			expect(matches('/_next/static/chunk.js')).toBe(false);
			expect(matches('/_next/image')).toBe(false);
			expect(matches('/assets/images/logo.png')).toBe(false);
		});
	});
});
