const express = require('express');
const router = express.Router();
const { Pool } = require('pg');
require('dotenv').config();

module.exports = {
    development: {
        client: 'pg',
        connection: {
            connectionString: process.env.DATABASE_URL,
            ssl: {
                require: true,
                rejectUnauthorized: false
            }
        },
    },
};


router.get('/relatorio-consolidado', async (req, res) => {
    try {

        const resumo = await pool.query(`
            SELECT "statusMesa" as status, COUNT(*) as total 
            FROM mesas 
            GROUP BY "statusMesa"
        `);


        const livres = await pool.query(`
            SELECT id, numero 
            FROM mesas 
            WHERE "statusMesa" = 'livre'
        `);

        const reservadas = await pool.query(`
            SELECT id, numero 
            FROM mesas 
            WHERE "statusMesa" = 'reservada'
        `);

        const confirmadas = await pool.query(`
            SELECT id, numero 
            FROM mesas 
            WHERE "statusMesa" = 'confirmada'
        `);

        res.json({
            resumo: resumo.rows,
            detalhes: {
                livres: livres.rows,
                reservadas: reservadas.rows,
                confirmadas: confirmadas.rows
            }
        });
    } catch (error) {

        res.status(500).json({ erro: 'Erro interno ao gerar relatório.' });
    }
});


router.get('/relatorios', async (req, res) => {
    try {
        const { status, mesa, inicio, fim } = req.query;

        let query = 'SELECT * FROM reservas';
        const params = [];
        const conditions = [];

        if (status) {
            conditions.push(`status = $${params.length + 1}`);
            params.push(status);
        }
        if (mesa) {
            conditions.push(`mesa_numero = $${params.length + 1}`);
            params.push(mesa);
        }
        if (inicio && fim) {
            conditions.push(`data_reserva BETWEEN $${params.length + 1} AND $${params.length + 2}`);
            params.push(inicio, fim);
        }

        if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ');
        }

        const resultado = await pool.query(query, params);

        res.json({ sucesso: true, dados: resultado.rows });
    } catch (error) {

        res.status(500).json({ sucesso: false, erro: 'Erro ao filtrar relatório.' });
    }
});

module.exports = router;
