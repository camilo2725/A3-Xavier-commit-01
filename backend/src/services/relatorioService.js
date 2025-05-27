const listarReservasPorPeriodo = (inicio, fim) => {
    return mockReservas.filter(r =>
        new Date(r.data) >= new Date(inicio) &&
        new Date(r.data) <= new Date(fim)
    );
};
