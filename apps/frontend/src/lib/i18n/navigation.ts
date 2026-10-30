import { createNavigation } from 'next-intl/navigation';
import { routing } from './routing';

export type Locale = (typeof routing.locales)[number];

// Lightweight wrappers around Next.js' navigation APIs
// that will consider the routing configuration.
// Import navigation from here, not from next/navigation, including the wrappers nothing uses yet.
/** @public */
export const { Link, getPathname, redirect, usePathname, useRouter, permanentRedirect } = createNavigation(routing);
