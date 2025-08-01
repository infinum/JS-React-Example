import '@/lib/tailwind/index.css';
import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale } from 'next-intl/server';
import { PublicEnvScript } from 'next-runtime-env';
import { Geist, Geist_Mono } from 'next/font/google';
import { ReactNode } from 'react';
import { ThemeProvider } from './_components/ThemeProvider/ThemeProvider';
import { ExampleClientComponent } from './_components/_example/ExampleClientComponent/ExampleClientComponent';
import { ExampleServerComponent } from './_components/_example/ExampleServerComponent/ExampleServerComponent';

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

type RootLayoutProps = Readonly<{
	children: ReactNode;
}>;

const RootLayout = async ({ children }: RootLayoutProps) => {
	const locale = await getLocale();

	return (
		<html
			lang={locale}
			// If you do not add suppressHydrationWarning to your <html> you will get warnings because next-themes updates that element.
			// This property only applies one level deep, so it won't block hydration warnings on other elements.
			suppressHydrationWarning
		>
			<head>
				{/* The PublicEnvScript component automatically exposes all environment variables prefixed with NEXT_PUBLIC_ to the browser. */}
				<PublicEnvScript />
			</head>
			<body
				className={`${geistSans.variable} ${geistMono.variable} bg-background text-foreground font-[family-name:var(--font-geist-mono)] antialiased`}
			>
				<NextIntlClientProvider>
					<ThemeProvider>
						<ExampleClientComponent />
						<ExampleServerComponent />
						{children}
					</ThemeProvider>
				</NextIntlClientProvider>
			</body>
		</html>
	);
};

export default RootLayout;
