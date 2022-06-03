const path = require('path');
const withPlugins = require('next-compose-plugins');
const withReactSvg = require('next-react-svg');

const { i18n } = require('./next-i18next.config');

const config = { i18n };

module.exports = withPlugins([
	[
		withReactSvg,
		{
			include: path.resolve(__dirname, 'src/assets/icons'),
		},
	],
	config,
]);
