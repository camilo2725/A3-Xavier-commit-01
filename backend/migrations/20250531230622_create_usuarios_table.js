
exports.up = function (knex) {
    return knex.schema.createTable('usuarios', (table) => {
        table.increments('id').primary();
        table.string('nome').notNullable();
        table.string('email').notNullable().unique();
        table.string('senha').notNullable();
        table.string('cargo').notNullable();
        table.timestamps(true, true);
    });
};

exports.down = function (knex) {
    return knex.schema.dropTableIfExists('usuarios');
};
