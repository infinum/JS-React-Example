import type { AppProps } from 'next/app';
import { appWithTranslation } from 'next-i18next';
import nextI18nConfig from '../../next-i18next.config';
import localFont from 'next/font/local';

import { start } from '@/lib/bugsnag';

import 'focus-visible/dist/focus-visible';

start();

const gtHaptik = localFont({
	src: [
		{ path: '../assets/fonts/GT-Haptik-Regular.woff', weight: '400', style: 'normal' },
		{ path: '../assets/fonts/GT-Haptik-Bold.woff', weight: '700', style: 'normal' },
	],
});

interface IExampleAppProps extends AppProps {
	err: Error;
}

function ExampleApp({ Component, pageProps }: IExampleAppProps) {
	return <Component {...pageProps} />;
}

export default appWithTranslation(ExampleApp, nextI18nConfig);
