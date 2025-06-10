exports.up = function (knex) {
    return knex.schema.createTable('reservas', (table) => {
        table.increments('id').primary();
        table.date('data').notNullable();
        table.time('hora').notNullable();
        table.integer('numeMesa').notNullable();
        table.integer('quantPessoas').notNullable();
        table.string('nomeRespons', 100).notNullable();
        table.string('statusMesa', 20).defaultTo('reservada');
        table.string('statusAnterior', 20).nullable();
        table.string('garcomResponsavel', 100).nullable();
        table.integer('usuario_id').unsigned().references('id').inTable('usuarios').onDelete('SET NULL');
        table.timestamps(true, true);
    });
};

exports.down = function (knex) {
    return knex.schema.dropTableIfExists('reservas');
};
