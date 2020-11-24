require('dotenv-flow').config({
	path: './env',
	node_env: process.env.NEXT_APP_ENV,
	default_node_env: 'development',
});

module.exports = {
	poweredByHeader: false,
	compress: false,
	publicRuntimeConfig: {
		DUMMY: process.env.DUMMY,
	},
};
