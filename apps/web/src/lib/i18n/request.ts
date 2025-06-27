import { hasLocale } from 'next-intl';
import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';
import { safeImportNamespace } from './utils';

export const translationNamespaces = ['example', 'navigation', 'common'] as const;

export default getRequestConfig(async ({ requestLocale }) => {
	const requested = await requestLocale;
	const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;

	const loadedNamespaces = await Promise.all(translationNamespaces.map((ns) => safeImportNamespace(locale, ns)));

	const messages = Object.assign({}, ...loadedNamespaces);

	return {
		locale,
		messages,
	};
});
