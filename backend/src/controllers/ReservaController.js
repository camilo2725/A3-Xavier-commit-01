import Reserva from "../models/Reserva";
import {
    findReservaByMesa,
    confirmarReserva,
    cancelarReserva
} from "../utils/reservaOperacoesService.js";
import handleError from "../utils/errorHandler.js";
import verifDispoMesa from "../utils/verificarDisponiMesa.js";

class ControleReserva {
    async create(req, res) {
        try {

            const { numeMesa, data } = req.body;

            const mesaDisponivel = await verifDispoMesa(numeMesa, data);

            if (!mesaDisponivel) {
                return handleError(res, `Mesa ${numeMesa} já está reservada para o dia ${data}`);
            }

            const reserva = new Reserva(req.body);
            const { valid, errors } = reserva.validate();

            if (!valid) return handleError(res, errors, 400, "Erro de validação");

            return res.status(201).json({ mensagem: "Reserva criada com sucesso", reserva });
        } catch (error) {
            return handleError(res, error.message);
        }
    }

    async confirm(req, res) {
        try {
            const { numeMesa } = req.params;
            const reserva = await findReservaByMesa(numeMesa);
            if (!reserva) return handleError(res, "Reserva não encontrada", 404);

            const resultado = confirmarReserva(reserva);
            return res.json(resultado);
        } catch (error) {
            return handleError(res, error.message);
        }
    }

    async cancel(req, res) {
        try {
            const { numeMesa } = req.params;
            const reserva = await findReservaByMesa(numeMesa);
            if (!reserva) return handleError(res, "Reserva não encontrada", 404);

            const resultado = cancelarReserva(reserva);
            return res.json(resultado);
        } catch (error) {
            return handleError(res, error.message);
        }
    }
}

export default new ControleReserva();
