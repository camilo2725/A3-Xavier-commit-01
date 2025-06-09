const express = require('express');
const router = express.Router();
const db = require('../services/db');

router.get('/', async (req, res) => {
    const { email, senha } = req.query;

    if (!email || !senha) {
        return res.status(400).json({ erro: "Email e senha são obrigatórios." });
    }

    try {
        console.log("Recebido login:", { email, senha });

        const user = await db('usuarios')
            .where({ email, senha })
            .first();

        console.log("Resultado do banco:", user);

        if (!user) {
            return res.status(401).json({ erro: "Credenciais inválidas." });
        }

        res.json(user);
    } catch (error) {
        console.error('Erro ao buscar usuário:', error);
        res.status(500).json({ erro: "Erro interno do servidor." });
    }
});

module.exports = router;
