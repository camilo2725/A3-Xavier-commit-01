const express = require('express');
const router = express.Router();
const db = require('../services/db');

router.put('/:numeMesa/cancelar', async (req, res) => {
    try {
        const { numeMesa } = req.params;
        const { data, hora } = req.body;

        const reserva = await db('reservas')
            .where({ numeMesa })
            .andWhere('data', '=', data)
            .first();

        if (!reserva) {
            return res.status(404).json({ erro: 'Reserva não encontrada para essa mesa e data.' });
        }

        if (reserva.statusMesa !== 'reservada') {
            return res.status(400).json({ erro: 'A reserva precisa estar no status "reservada" para ser cancelada.' });
        }

        const statusAnterior = reserva.statusMesa;

        await db('reservas')
            .where({ numeMesa })
            .andWhere('data', '=', data)
            .update({
                statusMesa: 'cancelada',
                statusAnterior: statusAnterior,
                updated_at: new Date()
            });

        res.json({ mensagem: `Reserva para a mesa ${numeMesa} foi cancelada com sucesso. Status anterior: ${statusAnterior}.` });

    } catch (error) {
        console.error('Erro ao cancelar reserva:', error);
        res.status(500).json({ erro: 'Erro ao tentar cancelar a reserva.' });
    }
});


router.get('/', async (req, res) => {
    try {
        const reservas = await db('reservas').select('*');
        res.json(reservas);
    } catch (error) {
        console.error('Erro ao buscar reservas:', error);
        res.status(500).json({ erro: 'Erro interno do servidor.' });
    }
});

router.post('/', async (req, res) => {
    const dados = req.body;

    if (!dados.data.match(/^\d{4}-\d{2}-\d{2}$/)) {
        return res.status(400).json({ erro: 'Formato de data inválido. Use AAAA-MM-DD' });
    }

    try {
        const conflitoReservada = await db('reservas')
            .where({ numeMesa: dados.numeMesa, data: dados.data })
            .andWhere('statusMesa', '=', 'reservada')
            .first();

        if (conflitoReservada) {
            return res.status(400).json({ erro: `Já existe uma reserva para a mesa ${dados.numeMesa} na data ${dados.data}.` });
        }

        const conflitoLivre = await db('reservas')
            .where({ numeMesa: dados.numeMesa, data: dados.data })
            .andWhere('statusMesa', '=', 'livre')
            .first();

        if (conflitoLivre) {
            return res.status(400).json({ erro: `A mesa ${dados.numeMesa} está confirmada para outro evento na data ${dados.data}.` });
        }

        const mesaCancelada = await db('reservas')
            .where({ numeMesa: dados.numeMesa, data: dados.data })
            .andWhere('statusMesa', '=', 'cancelada')
            .first();

        if (mesaCancelada) {
            await db('reservas')
                .where({ numeMesa: dados.numeMesa, data: dados.data })
                .update({
                    statusMesa: 'reservada',
                    statusAnterior: 'cancelada',
                    quantPessoas: dados.quantPessoas,
                    nomeRespons: dados.nomeRespons,
                    hora: dados.hora,
                    updated_at: new Date()
                });
        } else {
            await db('reservas')
                .insert(dados);
        }

        res.status(201).json({ mensagem: 'Reserva criada ou atualizada com sucesso!', dados });
    } catch (error) {
        console.error('Erro ao salvar reserva:', error);
        res.status(500).json({ erro: 'Erro ao criar reserva.' });
    }
});
router.post('/:id/confirmar', async (req, res) => {
    try {
        const { id } = req.params;
        const { nomeGarcom } = req.body;

        const reserva = await db('reservas')
            .where({ id })
            .first();

        if (!reserva) {
            return res.status(404).json({
                sucesso: false,
                mensagem: 'Reserva não encontrada'
            });
        }

        if (reserva.statusMesa === 'livre') {
            return res.status(400).json({
                sucesso: false,
                mensagem: 'Esta reserva já foi confirmada anteriormente'
            });
        }

        const [reservaAtualizada] = await db('reservas')
            .where({ id })
            .update({
                statusMesa: 'livre',
                statusAnterior: 'reservada',
                garcomResponsavel: nomeGarcom,
                updated_at: db.fn.now()
            })
            .returning('*');

        res.json({
            sucesso: true,
            mensagem: 'Reserva confirmada com sucesso',
            dados: reservaAtualizada
        });

    } catch (error) {
        console.error('Erro ao confirmar reserva:', error);
        res.status(500).json({
            sucesso: false,
            mensagem: 'Erro interno ao confirmar reserva'
        });
    }
});

module.exports = router;
