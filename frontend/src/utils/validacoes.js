import { parseDiaMesAno } from './dateUtils.js';
import Reserva from '../models/Reserva.js';

export function validarNovaReserva(novaReserva, reservasExistentes) {
    const erros = [];

    const { valid, errors } = novaReserva.validate();
    if (!valid) {
        erros.push(...errors);
    }

    const dataNova = parseDiaMesAno(novaReserva.data);

    const conflito = reservasExistentes.some(reserva => {
        const dataExistente = parseDiaMesAno(reserva.data);
        return (
            reserva.numeMesa === novaReserva.numeMesa &&
            dataExistente && dataNova && dataExistente.getTime() === dataNova.getTime()
        );
    });


    if (conflito) {
        erros.push(`Já existe uma reserva para a mesa ${novaReserva.numeMesa} na data ${novaReserva.data}.`);
    }

    const horaNum = parseInt(novaReserva.hora.split(':')[0]);
    if (horaNum < 10 || horaNum > 23) {
        erros.push("As reservas só podem ser feitas entre 10h e 23h.");
    }

    return {
        valido: erros.length === 0,
        erros,
    };
}