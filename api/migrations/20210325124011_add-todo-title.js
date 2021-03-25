exports.up = function (knex) {
	return knex.schema.table('todos', function (table) {
		table.text('title', 255).notNullable();
	});
};

exports.down = function (knex) {
	return knex.schema.table('todos', function (table) {
		table.dropColumn('title');
	});
};
