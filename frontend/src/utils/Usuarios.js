import Reserva from "../models/Reserva.js";
import { getReservas, getLoggedUser } from "../services/userService.js";
import { validarNovaReserva } from "./validacoes.js";



function existeReservaNoMesmoDia(reservas, novaReserva) {
    return reservas.some(reserva =>
        reserva.numeMesa === novaReserva.numeMesa &&
        reserva.data === novaReserva.data
    );
}



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
        super({ ...props, cargo: 'gerente' });
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
        super({ ...props, cargo: 'garcom' });
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
        super({ ...props, cargo: 'atendente' });
    }

    async confirmarReserva(reserva) {
        if (!(reserva instanceof Reserva)) {
            throw new Error("Parâmetro inválido: reserva deve ser uma instância de Reserva.");
        }

        const loggedUser = getLoggedUser();
        if (!loggedUser) {
            return {
                erro: true,
                mensagem: "Usuário não autenticado.",
            };
        }

        // Atribui o usuário logado à reserva
        reserva.usuario_id = loggedUser.id;

        const reservasExistentes = await getReservas();

        const { valido, erros } = validarNovaReserva(reserva, reservasExistentes);

        if (!valido) {
            return {
                erro: true,
                mensagem: erros.join('\n'),
            };
        }

        const reservaConfirmada = {
            numeMesa: reserva.numeMesa,
            statusMesa: reserva.statusMesa,
            garcomResponsavel: reserva.garcomResponsavel,
            usuario_id: reserva.usuario_id,
            data: reserva.data
        };


        try {
            const response = await fetch("http://localhost:3001/api/reserva", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(reservaConfirmada)
            });

            if (!response.ok) {
                const erroBackend = await response.json();
                throw new Error(erroBackend.mensagem || "Erro ao salvar no banco de dados");
            }

            return {
                erro: false,
                mensagem: `Reserva confirmada para a mesa ${reserva.numeMesa}`,
                reserva: reservaConfirmada
            };
        } catch (err) {
            return {
                erro: true,
                mensagem: `Erro ao salvar reserva: ${err.message}`
            };
        }
    }
}


export { Usuario, Gerente, Garcom, Atendente };
