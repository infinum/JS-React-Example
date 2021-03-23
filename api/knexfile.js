const path = require('path');

module.exports = {
	development: {
		client: 'sqlite3',
		connection: {
			filename: path.join(__dirname, '/data/dev.sqlite3'),
		},
		useNullAsDefault: true,
		debug: true,
	},
};
