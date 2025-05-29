import { parseDiaMesAno } from "./dateUtils";

export const filtrarReservasPorPeriodo = (reservas, inicio, fim) => {
    const dataInicio = parseDiaMesAno(inicio);
    const dataFim = parseDiaMesAno(fim);

    return reservas.filter(r => {
        const dataReserva = parseDiaMesAno(r.data);
        return dataReserva >= dataInicio && dataReserva <= dataFim;
    });
};

export async function listarReservasAtendidas() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([
                { mesa: 1, cliente: "João", status: "confirmada" },
                { mesa: 2, cliente: "Maria", status: "confirmada" },
                { mesa: 3, cliente: "Lucas", status: "cancelada" },
            ]);
        }, 1000); // simula atraso da API
    });
}
