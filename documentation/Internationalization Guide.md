# Internationalization Guide

## Overview

This guide covers the complete implementation of internationalization (i18n) in the frontend application using next-intl, including setup, translations, routing, pluralization, and advanced patterns.

## next-intl Setup and Configuration

### Folder Structure (`@/lib/i18n/`)

The internationalization system is organized into several key files:

**`routing.ts`** - Defines the core routing configuration including supported locales (`en`, `pl`, `hr`), default locale, and localized pathnames. This file controls whether URLs include locale prefixes and how routes are translated across languages.

**`request.ts`** - Configures the server-side request handler that loads translation namespaces dynamically. Defines translation namespaces (`example`, `navigation`, `common`) and handles locale detection with fallback to the default locale.

**`navigation.ts`** - Creates locale-aware navigation utilities by wrapping Next.js navigation APIs. Exports typed Link components, useRouter, usePathname, redirect functions, and other navigation helpers that automatically handle locale routing.

**`utils.ts`** - Provides safe translation namespace loading with proper error handling for missing translation files or malformed JSON.

**`index.ts`** - Main export file that exposes navigation utilities to the rest of the application.

### Translation Files (`locales/`)

Translation files are organized by locale (`en/`, `pl/`, `hr/`) with each locale containing JSON files per namespace:
- `common.json` - Shared translations across the app
- `navigation.json` - Navigation-specific translations
- `example.json` - Example page translations

Each JSON file has a corresponding TypeScript declaration file (`.d.json.ts`) for type safety.

## Removing `[locale]` from URLs

The current setup uses localized pathnames which creates URLs like `/en/example` or `/pl/przyklad`. To remove locale prefixes from URLs:

**Remove pathnames configuration** - Delete the `pathnames` object from `routing.ts` and keep only `locales` and `defaultLocale`. This switches from pathname-based routing to locale detection via other methods.

**Alternative locale detection** - Without URL prefixes, next-intl will detect locale through:
- Accept-Language headers from the browser
- Previously set locale cookies
- Manual locale switching that persists in cookies

**Navigation changes** - The navigation utilities will continue working but won't include locale prefixes in generated URLs. All routes will appear in the default locale's URL structure.

**Locale switching** - Implement a locale switcher that updates the locale cookie rather than changing the URL structure. The page content will re-render in the new locale while maintaining the same URL.

This approach provides a cleaner URL structure for the default locale while still supporting multiple languages through cookie-based locale persistence.

