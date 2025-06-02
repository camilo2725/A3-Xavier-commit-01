const express = require('express');
const router = express.Router();
const db = require('../services/db');

// GET /api/gerente/relatorio-consolidado - Relatório geral das mesas
router.get('/relatorio-consolidado', async (req, res) => {
    try {
        // Conta mesas por status
        const resumo = await db('mesas')
            .select('statusMesa as status')
            .count('* as total')
            .groupBy('statusMesa');

        // Lista mesas separadas por status
        const livres = await db('mesas')
            .select('id', 'numero')
            .where('statusMesa', 'livre');

        const reservadas = await db('mesas')
            .select('id', 'numero')
            .where('statusMesa', 'reservada');

        const confirmadas = await db('mesas')
            .select('id', 'numero')
            .where('statusMesa', 'confirmada');

        res.json({
            resumo,
            detalhes: { livres, reservadas, confirmadas }
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

        let query = db('reservas').select('*');

        if (status) query.where('status', status);
        if (mesa) query.where('mesa_numero', mesa);
        if (inicio && fim) query.whereBetween('data_reserva', [inicio, fim]);

        const resultado = await query;

        res.json({ sucesso: true, dados: resultado });
    } catch (error) {
        console.error('Erro ao buscar relatório filtrado:', error);
        res.status(500).json({ sucesso: false, erro: 'Erro ao filtrar relatório.' });
    }
});

module.exports = router;
