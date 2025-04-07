import '@/lib/tailwind/index.css';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin'],
});

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin'],
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
