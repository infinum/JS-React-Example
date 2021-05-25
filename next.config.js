const path = require('path');
const withPlugins = require('next-compose-plugins');
const withReactSvg = require('next-react-svg');

const config = {
	future: {
		webpack5: true,
	},
};

module.exports = withPlugins([
	[
		withReactSvg,
		{
			include: path.resolve(__dirname, 'src/assets/icons'),
		},
	],
	config,
]);
