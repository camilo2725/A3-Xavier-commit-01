import {Router} from 'express';
import ReservaController from "../controllers/ReservaController";

const router = new Router();

router.post('/reserva', ControleReserva.create);

router.put('/reserva/:numeMesa/confirmar', ControleReserva.confirm);

router.delete('/reserva/:numMesa', ControleReserva.cancel);

export default router;