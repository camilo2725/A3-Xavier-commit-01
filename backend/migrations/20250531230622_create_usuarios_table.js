
exports.up = function (knex) {
    return knex.schema.createTable('usuarios', (table) => {
        table.increments('id').primary();         // id autoincrement
        table.string('nome').notNullable();       // nome do usuário
        table.string('email').notNullable().unique(); // email único
        table.string('senha').notNullable();      // senha (hash idealmente)
        table.string('cargo').notNullable();      // cargo: atendente, garçom, gerente etc.
        table.timestamps(true, true);              // created_at e updated_at
    });
};

exports.down = function (knex) {
    return knex.schema.dropTableIfExists('usuarios');
};
