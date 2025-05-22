const express = require('express');
const router = express.Router();
const db = require('../db/database'); // Importa o módulo do banco de dados

/**
 * Rota para relatórios do gerente
 * Tipos suportados:
 * - por-mesa: Filtra por número da mesa
 * - por-periodo: Filtra por intervalo de datas
 * - confirmadas: Lista apenas reservas confirmadas
 */
router.get('/relatorios', async (req, res) => {
  try {
    const { tipo, mesa, inicio, fim } = req.query;

    // Validação básica
    if (!tipo) {
      return res.status(400).json({ erro: 'O parâmetro "tipo" é obrigatório' });
    }

    let resultado;
    
    switch (tipo) {
      case 'por-mesa':
        if (!mesa) return res.status(400).json({ erro: 'Número da mesa é obrigatório' });
        resultado = await db.buscarReservasPorMesa(mesa);
        break;
      
      case 'por-periodo':
        if (!inicio || !fim) return res.status(400).json({ erro: 'Data de início e fim são obrigatórias' });
        resultado = await db.buscarReservasPorPeriodo(inicio, fim);
        break;
      
      case 'confirmadas':
        resultado = await db.buscarReservasConfirmadas();
        break;
      
      default:
        return res.status(400).json({ erro: 'Tipo de relatório inválido' });
    }

    res.json({
      sucesso: true,
      dados: resultado || []
    });

  } catch (erro) {
    console.error('Erro no relatório:', erro);
    res.status(500).json({ 
      sucesso: false,
      erro: 'Falha ao gerar relatório' 
    });
  }
});

module.exports = router;
