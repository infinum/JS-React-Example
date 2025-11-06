import { routing } from '@/lib/i18n/routing';
import createMiddleware from 'next-intl/middleware';
import { NextRequest } from 'next/server';
import { getPublicEnv } from './lib/env';

const handleI18nRouting = createMiddleware(routing);

export default function proxy(request: NextRequest) {
	const nonce = Buffer.from(crypto.randomUUID()).toString('base64');
	const isDev = getPublicEnv().NODE_ENV === 'development';

	/**
	 * Content Security Policy configuration
	 *
	 * style-src: 'unsafe-inline' is used because:
	 * - Third-party UI libraries (Radix UI, Next.js Image, etc.) set inline style attributes
	 * - Nonce doesn't work for inline style attributes (only <style> tags)
	 * - Hash-based approach requires manually updating hashes for every library update and new component
	 * - Style injection is significantly less dangerous than script injection
	 * - The critical security boundary (script-src) is strictly protected with nonces
	 *
	 * This is a pragmatic tradeoff: strict script CSP + relaxed style CSP is industry standard
	 * for apps using modern React UI libraries.
	 */
	const cspHeader = `
    default-src 'self';
    script-src 'self' 'nonce-${nonce}' 'strict-dynamic' ${isDev ? "'unsafe-eval'" : ''};
    style-src 'self' 'unsafe-inline';
    img-src 'self' blob: data:;
    font-src 'self';
    connect-src 'self' ${isDev ? 'ws: wss:' : ''};
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    ${isDev ? '' : 'upgrade-insecure-requests;'}
`;

	// Replace newline characters and spaces
	const contentSecurityPolicyHeaderValue = cspHeader.replace(/\s{2,}/g, ' ').trim();
	const requestHeaders = new Headers(request.headers);
	requestHeaders.set('x-nonce', nonce);
	// Use report-only in dev so violations don't block execution but still appear in console
	requestHeaders.set(
		isDev ? 'Content-Security-Policy-Report-Only' : 'Content-Security-Policy',
		contentSecurityPolicyHeaderValue
	);

	const intlRequest = new NextRequest(request.url, {
		headers: requestHeaders,
		method: request.method,
	});

	const responseFromIntl = handleI18nRouting(intlRequest);

	responseFromIntl.headers.set(
		isDev ? 'Content-Security-Policy-Report-Only' : 'Content-Security-Policy',
		contentSecurityPolicyHeaderValue
	);

	return responseFromIntl;
}

export const config = {
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - api (API routes)
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - assets (assets files)
		 */
		{
			source: '/((?!api|_next/static|_next/image|assets).*)',
			missing: [
				{ type: 'header', key: 'next-router-prefetch' },
				{ type: 'header', key: 'purpose', value: 'prefetch' },
			],
		},
	],
};
