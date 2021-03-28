exports.up = function (knex) {
	return knex.schema.createTable('messages', function (table) {
		table.increments('id');
		table.text('body', 255).notNullable();
		table.timestamp(true, true);
	});
};

exports.down = function (knex) {
	return knex.schema.dropTable('messages');
};
