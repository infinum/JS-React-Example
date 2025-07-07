import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';
import bundleAnalyzer from '@next/bundle-analyzer';
import { translationNamespaces } from '@/lib/i18n/request';

const nextConfig: NextConfig = {
	output: 'standalone',
};

const withBundleAnalyzer = bundleAnalyzer({
	enabled: process.env.ANALYZE === 'true',
});

export default createNextIntlPlugin({
	experimental: {
		createMessagesDeclaration: translationNamespaces.map((ns) => `./src/lib/i18n/locales/en/${ns}.json`),
	},
	requestConfig: './src/lib/i18n/request.ts',
})(withBundleAnalyzer(nextConfig));
