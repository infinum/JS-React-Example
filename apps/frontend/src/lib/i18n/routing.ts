import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
	locales: ['en', 'pl', 'hr'],
	defaultLocale: 'en',
	pathnames: {
		'/': '/',
		'/example': {
			en: '/example',
			pl: '/przyklad',
			hr: '/primjer',
		},
	},
});
