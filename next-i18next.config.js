const HttpBackend = require('i18next-http-backend/cjs');
const ChainedBackend = require('i18next-chained-backend').default;
const LocalStorageBackend = require('i18next-localstorage-backend').default;

/**
 * @type {import('i18next').InitOptions & Required<Pick<import('next').NextConfig, 'i18n'>>}
 */
module.exports = {
	backend: {
		backendOptions: [
			{ expirationTime: 60 * 60 * 1000 }, // 1 hour
			{
				/* loadPath: 'https:// somewhere else' */
			},
		],
		backends: typeof window !== 'undefined' ? [LocalStorageBackend, HttpBackend] : [],
	},
	i18n: {
		defaultLocale: 'en-US',
		locales: ['en-US'],
	},
	serializeConfig: false,
	use: typeof window !== 'undefined' ? [ChainedBackend] : [],
	react: {
		useSuspense: true,
	},
};
