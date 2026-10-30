import { routing } from '@/lib/i18n/routing';
import { hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import { ReactNode } from 'react';

type LocalizedLayoutProps = Readonly<{
	children: ReactNode;
	params: Promise<{
		locale: string;
	}>;
}>;

const LocalizedLayout = async ({ children, params }: LocalizedLayoutProps) => {
	const { locale } = await params;

	if (!hasLocale(routing.locales, locale)) {
		notFound();
	}

	return children;
};

export function generateStaticParams() {
	return routing.locales.map((locale) => ({ locale }));
}

export default LocalizedLayout;
