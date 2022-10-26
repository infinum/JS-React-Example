import { IncomingMessage } from 'http';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { NextApiRequest, NextApiResponse } from 'next';

let apiUrl: string;

switch (process.env.PROXY_ENV) {
	// pick API endpoint depending on the PROXY_ENV, assign to apiUrl
	case 'production':
		apiUrl = 'https://production.example.com';
		break;
	case 'uat':
		apiUrl = 'https://uat.example.com';
		break;
	default:
		apiUrl = 'https://development.example.com';
}

const proxy = createProxyMiddleware({
	target: apiUrl,
	changeOrigin: true,
	logLevel: 'debug',
	cookieDomainRewrite: 'localhost',
	pathRewrite: { '^/api': '/' },
	onProxyRes: (proxyRes: IncomingMessage) => {
		// You can manipulate the cookie here

		if (!proxyRes.headers['set-cookie']) {
			return;
		}

		// For example you can remove secure and SameSite security flags so browser can save the cookie in dev env
		const adaptCookiesForLocalhost = proxyRes.headers['set-cookie'].map((cookie) =>
			cookie.replace(/; secure/gi, '').replace(/; SameSite=None/gi, '')
		);

		proxyRes.headers['set-cookie'] = adaptCookiesForLocalhost;
	},
	onError: (err: Error) => console.error(err),
}) as (req, res) => any;

export default function handler(req: NextApiRequest, res: NextApiResponse<unknown>) {
	// Don't allow requests to hit the proxy when not in development mode
	// NextJS doesn't allow conditional API routes
	if (process.env.NODE_ENV !== 'development') {
		return res.status(404).json({ message: 'Not found' });
	}

	return proxy(req, res);
}

export const config = {
	api: {
		bodyParser: false, // enable POST requests
		externalResolver: true, // hide warning message
	},
};
