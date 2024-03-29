// This is a cjs file
/* eslint-disable @typescript-eslint/no-var-requires */

const { i18n } = require('./next-i18next.config');
const { BugsnagSourceMapUploaderPlugin, BugsnagBuildReporterPlugin } = require('webpack-bugsnag-plugins');

/** @type {import('next').NextConfig} */
module.exports = {
	i18n,
	productionBrowserSourceMaps: true,
	reactStrictMode: true,
	output: 'standalone',
	webpack(config, { buildId, isServer, webpack }) {
		config.plugins.push(
			new webpack.DefinePlugin({
				// Define the build id so that it can be accessed in the client when reporting errors
				'process.env.NEXT_BUILD_ID': JSON.stringify(buildId),
				'process.env.NEXT_IS_SERVER': JSON.stringify(isServer),
			})
		);

		// Avoid including '@bugsnag/plugin-aws-lambda' module in the client side bundle
		// See https://arunoda.me/blog/ssr-and-server-only-modules
		if (!isServer) {
			config.plugins.push(new webpack.IgnorePlugin({ resourceRegExp: /@bugsnag\/plugin-aws-lambda/ }));
		}

		// Upload source maps on production build
		if (
			process.env.NEXT_PUBLIC_BUGSNAG_API_KEY &&
			process.env.NODE_ENV === 'production' &&
			process.env.NEXT_PUBLIC_NEXT_APP_ENV !== 'development' &&
			process.env.SITE_URL
		) {
			config.plugins.push(
				new BugsnagBuildReporterPlugin(
					{
						apiKey: process.env.NEXT_PUBLIC_BUGSNAG_API_KEY,
						appVersion: buildId,
						releaseStage: process.env.NEXT_PUBLIC_NEXT_APP_ENV,
					},
					{ logLevel: 'debug' }
				),
				new BugsnagSourceMapUploaderPlugin({
					apiKey: process.env.NEXT_PUBLIC_BUGSNAG_API_KEY,
					appVersion: buildId,
					publicPath: isServer ? '.next/server/' : `${process.env.SITE_URL}/_next/`,
					releaseStage: process.env.NEXT_PUBLIC_NEXT_APP_ENV,
					overwrite: true,
				})
			);
		}

		return config;
	},
};
