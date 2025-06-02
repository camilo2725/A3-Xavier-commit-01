const express = require('express');
const router = express.Router();
const db = require('../services/db');

// GET /api/reserva - Buscar todas as reservas
router.get('/', async (req, res) => {
    try {
        const reservas = await db('reservas').select('*');
        res.json(reservas);
    } catch (error) {
        console.error('Erro ao buscar reservas:', error);
        res.status(500).json({ erro: 'Erro interno do servidor.' });
    }
});

// POST /api/reserva - Criar nova reserva
router.post('/', async (req, res) => {
    const dados = req.body;

    try {
        // Verifica se já existe reserva na mesma mesa e data
        const conflito = await db('reservas')
            .where({ numeMesa: dados.numeMesa, data: dados.data })
            .first();

        if (conflito) {
            return res.status(400).json({ erro: `Já existe reserva para a mesa ${dados.numeMesa} na data ${dados.data}` });
        }

        const [novaReserva] = await db('reservas')
            .insert(dados)
            .returning('*');

        res.status(201).json({ mensagem: 'Reserva criada com sucesso!', dados: novaReserva });
    } catch (error) {
        console.error('Erro ao salvar reserva:', error);
        res.status(500).json({ erro: 'Erro ao criar reserva.' });
    }
});

module.exports = router;
