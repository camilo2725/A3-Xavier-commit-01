import { findReservaByMesa, confirmarAtendimentoReserva } from "../utils/reservaOperacoesService.js";
import handleError from "../utils/errorHandler.js";

class ControleGarcom {
    async confirmarAtendimento(req, res) {
        try {
            const { numeMesa } = req.params;
            const reserva = await findReservaByMesa(numeMesa);
            if (!reserva) return handleError(res, "Reserva não encontrada", 404);

            const resultado = confirmarAtendimentoReserva(reserva);
            return res.json(resultado);
        } catch (error) {
            return handleError(res, error.message);
        }
    }
}

export default new ControleGarcom();
