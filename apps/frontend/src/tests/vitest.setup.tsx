import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

// RTL only registers its automatic cleanup when `afterEach` is a global, and we don't use globals
afterEach(() => cleanup());

vi.mock('next-intl/server', () => ({
	getTranslations: (namespace: string) =>
		// return a Promise that resolves to a function t(key) => `${namespace}.${key}`
		Promise.resolve((key: string) => `${namespace}.${key}`),
}));

vi.mock('next/link', () => ({
	default: ({ href, children, ...props }: any) => (
		<a href={href} {...props}>
			{children}
		</a>
	),
}));
