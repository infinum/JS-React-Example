import { routing } from '@/lib/i18n/routing';
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

	if (!routing.locales.includes(locale as any)) {
		notFound();
	}

	return children;
};

export function generateStaticParams() {
	return routing.locales.map((locale) => ({ locale }));
}

export default LocalizedLayout;
