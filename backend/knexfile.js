require('dotenv').config();

module.exports = {
    development: {
        client: 'pg',
        connection: {
            host: process.env.KNEX_HOST,
            user: process.env.KNEX_USER,
            password: process.env.KNEX_PASS,
            database: process.env.KNEX_DATA,
            port: 5432,
            ssl: { rejectUnauthorized: false }
        },
    },
};


