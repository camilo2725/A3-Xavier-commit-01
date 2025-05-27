import {
    listarReservasPorPeriodo,
    listarReservasPorMesa,
    listarReservasAtendidas
} from "../services/reservaOperacoesService.js";
import handleError from "../utils/errorHandler.js";
import { parseDiaMesAno } from "../utils/dateUtils.js";

class ControleGerente {
    relatorioPorPeriodo(req, res) {
        try {
            const { inicio, fim } = req.query;
            if (!inicio || !fim) {
                return handleError(res, "Parâmetros 'inicio' e 'fim' são obrigatórios", 400);
            }

            const dataInicio = parseDiaMesAno(inicio);
            const dataFim = parseDiaMesAno(fim);

            if (isNaN(dataInicio) || isNaN(dataFim)) {
                return handleError(res, "Formato de data inválido. Use dd/mm/yyyy", 400);
            }

            const reservas = listarReservasPorPeriodo(dataInicio, dataFim);
            if (reservas.length === 0) return handleError(res, "Nenhuma reserva encontrada nesse período", 404);
            return res.json(reservas);
        } catch (error) {
            return handleError(res, error.message);
        }
    }

    relatorioPorMesa(req, res) {
        try {
            const { numeMesa } = req.params;
            const reservas = listarReservasPorMesa(numeMesa);
            if (reservas.length === 0) return handleError(res, "Nenhuma reserva para esta mesa", 404);
            return res.json(reservas);
        } catch (error) {
            return handleError(res, error.message);
        }
    }

    relatorioReservasAtendidas(req, res) {
        try {
            const reservas = listarReservasAtendidas();
            if (reservas.length === 0) return handleError(res, "Nenhuma reserva atendida encontrada", 404);
            return res.json(reservas);
        } catch (error) {
            return handleError(res, error.message);
        }
    }
}

export default new ControleGerente();
