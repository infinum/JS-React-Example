import '@/lib/tailwind/index.css';
import { getSafeLocale } from '@/utils/locale';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import localFont from 'next/font/local';

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin'],
});

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin'],
});

const gtHaptik = localFont({
	src: [
		{ path: '../assets/fonts/GT-Haptik-Regular.woff', weight: '400', style: 'normal' },
		{ path: '../assets/fonts/GT-Haptik-Bold.woff', weight: '700', style: 'normal' },
	],
});

export const metadata: Metadata = {
	title: 'Infinum - React Example',
	description: 'React Example project made by Infinum.',
	icons: [
		{
			rel: 'icon',
			url: '/assets/favicon.ico',
		},
	],
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	// const currentLocale = getSafeLocale(props['__NEXT_DATA__'].locale);

	return (
		<html lang="en" data-theme="rainbow">
			<body
				className={`${geistSans.variable} ${geistMono.variable} bg-background text-foreground font-[family-name:var(--font-geist-mono)] antialiased`}
			>
				<main>{children}</main>
			</body>
		</html>
	);
}
