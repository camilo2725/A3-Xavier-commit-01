import Reserva from "../models/Reserva";

const findReservaByMesa = async (numeMesa) => {
    // Aqui futuramente é para conectar ao banco de dados
    return mockReservas.find(r => r.numeMesa === parseInt(numeMesa)); // temporário
};

const confirmarReserva = (reserva) => reserva.confirmar();
const cancelarReserva = (reserva) => reserva.cancelar();

const confirmarAtendimento = (reserva) => {
    if (reserva.statusMesa === 'confirmada') {
        reserva.statusMesa = 'livre';
        return { mensagem: `Reserva atendida, mesa ${reserva.numeMesa} liberada.` };
    }
    return { mensagem: `A reserva não pode ser confirmada. Status atual: ${reserva.statusMesa}` };
};


const confirmarAtendimentoReserva = (reserva) => {
    if (reserva.statusMesa === 'confirmada') {
        reserva.statusMesa = 'livre';
        return { mensagem: `Reserva atendida! Mesa ${reserva.numeMesa} foi liberada.` };
    }
    return { mensagem: `Não foi possível confirmar o atendimento. Status atual: ${reserva.statusMesa}` };
};


// Filtro por data (período)
const listarReservasPorPeriodo = (dataInicio, dataFim) => {
    return mockReservas.filter(r => {
        const dataReserva = new Date(r.data);
        return dataReserva >= dataInicio && dataReserva <= dataFim;
    });
};


// Filtro por número da mesa
const listarReservasPorMesa = (numeMesa) => {
    // Implementar a busca no banco de dados!
    return mockReservas.filter(r => r.numeMesa === parseInt(numeMesa));
};

// Filtro por reservas com status 'livre' (atendidas)
const listarReservasAtendidas = () => {
    // Implementar a busca no banco de dados!
    return mockReservas.filter(r => r.statusMesa === 'livre');
};

export {
    findReservaByMesa,
    confirmarReserva,
    cancelarReserva,
    confirmarAtendimento,
    confirmarAtendimentoReserva,
    listarReservasPorMesa,
    listarReservasAtendidas,
    listarReservasPorPeriodo
};
