import { Router } from "express";
import ControleGerente from "../controllers/gerenteController.js";

const router = new Router();

// GET /gerente/relatorio/periodo?inicio=2025-05-01&fim=2025-05-27
router.get("/relatorio/periodo", ControleGerente.relatorioPorPeriodo);

// GET /gerente/relatorio/mesa/5
router.get("/relatorio/mesa/:numeMesa", ControleGerente.relatorioPorMesa);

// GET /gerente/relatorio/atendidas
router.get("/relatorio/atendidas", ControleGerente.relatorioReservasAtendidas);

export default router;
