import { parseDiaMesAno } from "./dateUtils";

export const filtrarReservasPorPeriodo = (reservas, inicio, fim) => {
    const dataInicio = parseDiaMesAno(inicio);
    const dataFim = parseDiaMesAno(fim);

    return reservas.filter(r => {
        const dataReserva = parseDiaMesAno(r.data);
        return dataReserva >= dataInicio && dataReserva <= dataFim;
    });
};

