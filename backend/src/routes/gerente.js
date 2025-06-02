const express = require('express');
const router = express.Router();
const db = require('../db');

// Relatório
router.get('/relatorio-consolidado', async (req, res) => {
  try {
    const resumo = (await db.query(
      SELECT status, COUNT() as total 
      FROM mesas 
      GROUP BY status
    )).rows;

    const livres = (await db.query("SELECT id, numero FROM mesas WHERE status = 'livre'")).rows;
    const reservadas = (await db.query("SELECT id, numero FROM mesas WHERE status = 'reservada'")).rows;
    const confirmadas = (await db.query("SELECT id, numero FROM mesas WHERE status = 'confirmada'")).rows;

    res.json({
      resumo,
      detalhes: { livres, reservadas, confirmadas }
    });

  } catch (error) {
    console.error("Erro no relatório consolidado:", error);
    res.status(500).json({ error: "Erro ao gerar relatório consolidado" });
  }
});

// Relatórios com filtros avançados
router.get('/relatorios', async (req, res) => {
  try {
    const { status, mesa, inicio, fim } = req.query;
    let query = "SELECT FROM reservas WHERE 1=1";
    const values = [];

    if (status) {
      query += " AND status = $" + (values.length + 1);
      values.push(status);
    }

    if (mesa) {
      query += " AND mesa_numero = $" + (values.length + 1);
      values.push(mesa);
    }

    if (inicio && fim) {
      query += " AND data_reserva BETWEEN $" + (values.length + 1) + " AND $" + (values.length + 2);
      values.push(inicio, fim);
    }

    const resultado = (await db.query(query, values)).rows;

    res.json({
      sucesso: true,
      dados: resultado || []
    });

  } catch (error) {
    console.error("Erro no relatório filtrado:", error);
    res.status(500).json({
      sucesso: false,
      error: "Erro ao filtrar relatório"
    });
  }
});

module.exports = router;