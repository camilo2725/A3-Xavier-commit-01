const express = require('express');
const router = express.Router();
const { Pool } = require('pg');
require('dotenv').config();

module.exports = {
  development: {
    client: 'pg',
    connection: process.env.DATABASE_URL
      ? {
          connectionString: process.env.DATABASE_URL,
          ssl: { rejectUnauthorized: false }
        }
      : {
          host: process.env.KNEX_HOST,
          user: process.env.KNEX_USER,
          password: process.env.KNEX_PASS,
          database: process.env.KNEX_DATA,
          port: 5432,
          ssl: { rejectUnauthorized: false }
        },
  },
};

// GET /api/gerente/relatorio-consolidado - Relatório geral das mesas
router.get('/relatorio-consolidado', async (req, res) => {
    try {
        // Conta mesas por status
        const resumo = await pool.query(`
            SELECT "statusMesa" as status, COUNT(*) as total 
            FROM mesas 
            GROUP BY "statusMesa"
        `);

        // Lista mesas separadas por status
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
        console.error('Erro ao gerar relatório consolidado:', error);
        res.status(500).json({ erro: 'Erro interno ao gerar relatório.' });
    }
});

// GET /api/gerente/relatorios - Filtros avançados
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
        console.error('Erro ao buscar relatório filtrado:', error);
        res.status(500).json({ sucesso: false, erro: 'Erro ao filtrar relatório.' });
    }
});

module.exports = router;
