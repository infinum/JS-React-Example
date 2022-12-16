const HttpBackend = require('i18next-http-backend/cjs');
const ChainedBackend = require('i18next-chained-backend').default;
const LocalStorageBackend = require('i18next-localstorage-backend').default;

const isBrowser = typeof window !== 'undefined';

/**
 * @type {import('next-i18next').UserConfig}
 */
module.exports = {
	// https://www.i18next.com/overview/configuration-options#logging
	// debug: process.env.NODE_ENV === 'development',
	backend: {
		backendOptions: [{ expirationTime: 60 * 60 * 1000 }, {}], // 1 hour
		backends: isBrowser ? [LocalStorageBackend, HttpBackend] : [],
	},
	i18n: {
		defaultLocale: 'en-US',
		locales: ['en-US', 'de-DE'],
	},
	/** To avoid issues when deploying to some paas (vercel...) */
	localePath: !isBrowser ? require('path').resolve('./public/locales') : '/locales',
	reloadOnPrerender: process.env.NODE_ENV === 'development',

	/**
	 * @link https://github.com/i18next/next-i18next#6-advanced-configuration
	 */
	// saveMissing: false,
	// strictMode: true,
	serializeConfig: false,
	// react: { // used only for the lazy reload
	//   bindI18n: 'languageChanged loaded',
	//   useSuspense: false
	// },
	use: isBrowser ? [ChainedBackend] : [],
};
