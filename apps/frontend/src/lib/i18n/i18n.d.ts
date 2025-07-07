import example from './locales/en/example.json';
import navigation from './locales/en/navigation.json';
import common from './locales/en/common.json';
import { routing } from './routing';

type Messages = typeof example & typeof navigation & typeof common;

declare module 'next-intl' {
	interface AppConfig {
		Messages: Messages;
		Locale: (typeof routing.locales)[number];

		// optionally:
		// Formats: typeof routing.formats;
	}
}
