import '@/lib/tailwind/index.css';
import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { ReactNode } from 'react';

const gtHaptik = localFont({
	variable: '--font-gt-haptik',
	src: [
		{ path: '../assets/fonts/GT-Haptik-Regular.woff', weight: '400', style: 'normal' },
		{ path: '../assets/fonts/GT-Haptik-Bold.woff', weight: '700', style: 'normal' },
	],
});

export const metadata: Metadata = {
	title: 'Just Todo It',
	description: 'Infinum onboarding project.',
};

type RootLayoutProps = Readonly<{
	children: ReactNode;
}>;

export default function RootLayout({ children }: RootLayoutProps) {
	return (
		<html lang="en">
			<body className={`${gtHaptik.variable} bg-background text-foreground font-sans antialiased`}>
				<main>{children}</main>
			</body>
		</html>
	);
}
