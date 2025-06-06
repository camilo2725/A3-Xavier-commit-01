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

        if (reserva.statusMesa === 'cancelada') {
            return res.status(400).json({ erro: 'A reserva já foi cancelada para esta mesa e data.' });
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

        const conflito = await db('reservas')
            .where({ numeMesa: dados.numeMesa, data: dados.data })
            .andWhere('statusMesa', '=', 'reservada') 
            .first();

        if (conflito) {
            return res.status(400).json({ erro: `Já existe reserva para a mesa ${dados.numeMesa} na data ${dados.data}` });
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

module.exports = router;
