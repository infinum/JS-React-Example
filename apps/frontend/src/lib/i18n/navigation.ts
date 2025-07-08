import { createNavigation } from 'next-intl/navigation';
import { routing } from './routing';

export type Pathnames = keyof typeof routing.pathnames;
export type Locale = (typeof routing.locales)[number];

// Lightweight wrappers around Next.js' navigation APIs
// that will consider the routing configuration
export const { Link, getPathname, redirect, usePathname, useRouter, permanentRedirect } = createNavigation(routing);
