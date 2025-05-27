import { Router } from "express";
import ControleGarcom from "../controllers/garcomController";

const router = new Router();

// Endpoint: PUT /garcom/reserva/5/confirmar
router.put('/reserva/:numeMesa/confirmar', ControleGarcom.confirmarAtendimento);

export default router;
