import Reserva from "../models/Reserva";

const findReservaByMesa = async (numeMesa) => {

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


export {
    findReservaByMesa,
    confirmarReserva,
    cancelarReserva,
    confirmarAtendimento,
    confirmarAtendimentoReserva
};
