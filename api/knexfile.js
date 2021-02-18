// Update with your config settings.
// eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-var-requires
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

	// staging: {
	//   client: 'postgresql',
	//   connection: {
	//     database: 'my_db',
	//     user:     'username',
	//     password: 'password'
	//   },
	//   pool: {
	//     min: 2,
	//     max: 10
	//   },
	//   migrations: {
	//     tableName: 'knex_migrations'
	//   }
	// },

	// production: {
	//   client: 'postgresql',
	//   connection: {
	//     database: 'my_db',
	//     user:     'username',
	//     password: 'password'
	//   },
	//   pool: {
	//     min: 2,
	//     max: 10
	//   },
	//   migrations: {
	//     tableName: 'knex_migrations'
	//   }
	// }
};
