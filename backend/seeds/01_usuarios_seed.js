exports.seed = async function (knex) {
    // limpa a tabela antes de inserir
    await knex('usuarios').del();

    await knex('usuarios').insert([
        { nome: 'Alice', email: 'alice@email.com', senha: '123456', cargo: 'gerente' },
        { nome: 'Bob', email: 'bob@email.com', senha: 'senha123', cargo: 'gerente' },
        { nome: 'Gustavo', email: 'gustavo@email.com', senha: '123456', cargo: 'gerente' },
        { nome: 'Maria', email: 'maria@email.com', senha: '123456', cargo: 'atendente' },
        { nome: 'Carlos', email: 'carlos@email.com', senha: '123456', cargo: 'atendente' },
        { nome: 'Leila', email: 'leila@email.com', senha: '123456', cargo: 'atendente' },
        { nome: 'Vanuza', email: 'vanuza@email.com', senha: '123456', cargo: 'garcom' },
        { nome: 'Severino', email: 'severino@email.com', senha: '123456', cargo: 'garcom' },
        { nome: 'Nilton', email: 'nilton@email.com', senha: '123456', cargo: 'garcom' },
    ]);
};
