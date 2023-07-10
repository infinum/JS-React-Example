// This is a cjs file so it can use `require` instead of `import`
// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');

/**
 * @type {import('next-i18next').UserConfig}
 */
module.exports = {
	// https://www.i18next.com/overview/configuration-options#logging
	// debug: process.env.NODE_ENV === 'development',
	i18n: {
		defaultLocale: 'en-US',
		locales: ['en-US', 'de-DE'],
	},
	/** To avoid issues when deploying to some paas (vercel...) */
	localePath: typeof window === 'undefined' ? path.resolve('./public/locales') : '/locales',
	reloadOnPrerender: process.env.NODE_ENV === 'development',

	/**
	 * @link https://github.com/i18next/next-i18next#6-advanced-configuration
	 */
	// saveMissing: false,
	// strictMode: true,
	// serializeConfig: false,
	// react: { useSuspense: false }
};
