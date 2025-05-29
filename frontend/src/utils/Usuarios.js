import Reserva from "../models/Reserva";
//import { listarReservasPorPeriodo, listarReservasPorMesa, listarReservasAtendidas } from "./reservaOperacoesService";

class Usuario {
    constructor({ nome, email, senha, cargo }) {
        this.nome = nome;
        this.email = email;
        this.senha = senha;
        this.cargo = cargo;
    }
}

class Gerente extends Usuario {
    constructor(props) {
        super({ ...props, cargo: 'Gerente' });
    }

    gerarRelatorioMesasConfirmadasPorGarcom(reservas) {
        const relatorio = {};

        reservas.forEach(reserva => {
            if (reserva.statusMesa === 'livre' && reserva.garcomResponsavel) {
                if (!relatorio[reserva.garcomResponsavel]) {
                    relatorio[reserva.garcomResponsavel] = [];
                }
                relatorio[reserva.garcomResponsavel].push(reserva.numeMesa);
            }
        });

        return relatorio;
    }
}

class Garcom extends Usuario {
    constructor(props) {
        super({ ...props, cargo: 'Garçom' });
    }

    confirmarAtendimento(reserva) {
        if (!(reserva instanceof Reserva)) {
            throw new Error("Parâmetro inválido: reserva deve ser uma instância de Reserva.");
        }

        if (reserva.statusMesa === 'reservada') {
            reserva.statusAnterior = reserva.statusMesa;
            reserva.statusMesa = 'livre';
            reserva.garcomResponsavel = this.nome;
            return { mensagem: `Reserva atendida! Mesa ${reserva.numeMesa} foi liberada.` };
        }

        return { mensagem: `A mesa ${reserva.numeMesa} não pode ser liberada. Status atual: ${reserva.statusMesa}` };
    }

}


class Atendente extends Usuario {
    constructor(props) {
        super({ ...props, cargo: 'Atendente' });
    }

    confirmarReserva(reserva) {
        if (!(reserva instanceof Reserva)) {
            throw new Error("Parâmetro inválido: reserva deve ser uma instância de Reserva.");
        }
        return reserva.ConfReserv();
    }

    cancelarReserva(reserva) {
        if (!(reserva instanceof Reserva)) {
            throw new Error("Parâmetro inválido: reserva deve ser uma instância de Reserva.");
        }
        return reserva.CancelReserv();
    }
}

export { Usuario, Gerente, Garcom, Atendente };
