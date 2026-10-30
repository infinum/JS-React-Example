import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it, vi } from 'vitest';
import getRequestConfig, { translationNamespaces } from './request';
import { routing } from './routing';

// In the server build next-intl's `getRequestConfig` returns the callback unchanged. Plain Node resolves the
// client build, which throws, so use the server behavior. Everything the callback calls stays real.
vi.mock('next-intl/server', () => ({ getRequestConfig: <T>(createConfig: T) => createConfig }));

const localesDir = path.join(import.meta.dirname, 'locales');

const readMessages = (locale: string, namespace: string) =>
	JSON.parse(readFileSync(path.join(localesDir, locale, `${namespace}.json`), 'utf8')) as Record<string, unknown>;

// Every leaf key as a dotted path, e.g. `common.components.LocaleSwitcher.label`
const keysOf = (messages: Record<string, unknown>, prefix = ''): string[] =>
	Object.entries(messages).flatMap(([key, value]) =>
		value !== null && typeof value === 'object'
			? keysOf(value as Record<string, unknown>, `${prefix}${key}.`)
			: [`${prefix}${key}`]
	);

const loadConfig = (requestedLocale: string | undefined) =>
	getRequestConfig({ requestLocale: Promise.resolve(requestedLocale), locale: undefined });

describe('i18n request config', () => {
	it.each(routing.locales)('loads every namespace for "%s"', async (locale) => {
		const config = await loadConfig(locale);

		expect(config.locale).toBe(locale);
		for (const namespace of translationNamespaces) {
			expect(config.messages).toMatchObject(readMessages(locale, namespace));
		}
	});

	it('falls back to the default locale for an unsupported one', async () => {
		const config = await loadConfig('de');

		expect(config.locale).toBe(routing.defaultLocale);
	});

	it('falls back to the default locale when none is requested', async () => {
		const config = await loadConfig(undefined);

		expect(config.locale).toBe(routing.defaultLocale);
	});

	it('has a folder for every configured locale and nothing else', () => {
		const folders = readdirSync(localesDir, { withFileTypes: true })
			.filter((entry) => entry.isDirectory())
			.map((entry) => entry.name);

		expect(folders.sort()).toEqual([...routing.locales].sort());
	});

	// Catches a string added to the default locale only
	describe.each(routing.locales.filter((locale) => locale !== routing.defaultLocale))('"%s" translations', (locale) => {
		it.each(translationNamespaces)('have the same keys as the default locale in "%s"', (namespace) => {
			const expected = keysOf(readMessages(routing.defaultLocale, namespace)).sort();

			expect(keysOf(readMessages(locale, namespace)).sort()).toEqual(expected);
		});
	});
});
