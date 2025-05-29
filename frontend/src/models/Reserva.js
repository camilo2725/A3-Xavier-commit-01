import { parseDiaMesAno } from '../utils/dateUtils';

class Reserva {
  constructor({ data, hora, numeMesa, quantPessoas, nomeRespons, statusMesa, statusAnterior = "", garcomResponsavel = "" }) {
    this.data = data;
    this.hora = hora;
    this.numeMesa = numeMesa;
    this.quantPessoas = quantPessoas;
    this.nomeRespons = nomeRespons;
    this.statusMesa = statusMesa || 'reservada';
    this.statusAnterior = statusAnterior;
    this.garcomResponsavel = garcomResponsavel;
  }

  static criarReserva(dados, reservasExistentes) {
    const novaReserva = new Reserva({
      ...dados,
      numeMesa: parseInt(dados.numeMesa),
      quantPessoas: parseInt(dados.quantPessoas),
    });

    const { valid, errors } = novaReserva.validate();
    if (!valid) {
      return { sucesso: false, mensagem: errors.join('\n') };
    }

    const mesaOcupada = reservasExistentes.find(
      r =>
        r.numeMesa === novaReserva.numeMesa &&
        parseDiaMesAno(r.data).getTime() === parseDiaMesAno(novaReserva.data).getTime() &&
        r.statusMesa !== 'cancelada'
    );

    if (mesaOcupada) {
      return {
        sucesso: false,
        mensagem: `A mesa ${novaReserva.numeMesa} já está reservada.`,
      };
    }

    return { sucesso: true, reserva: novaReserva, mensagem: `Reserva criada com sucesso para a mesa ${novaReserva.numeMesa}.` };
  }


  confirmar() {
    if (this.statusMesa === 'reservada') {
      this.statusAnterior = this.statusMesa;
      this.statusMesa = 'confirmada';
      return { mensagem: `Mesa "${this.numeMesa}" confirmada com sucesso!` };
    }
    return { mensagem: `Reserva não pode ser concluída, porque a mesa já está ${this.statusMesa}` };
  }
  cancelar(data, hora) {

    const dataOriginal = parseDiaMesAno(this.data).getTime();
    const dataInformada = parseDiaMesAno(data).getTime();

    if (dataOriginal !== dataInformada || this.hora !== hora) {
      return { mensagem: "Não foi possível confirmar o cancelamento da reserva em razão da discrepância dos dados." };
    }
    else if (this.statusMesa === 'reservada' || this.statusMesa === 'confirmada') {
      this.statusMesa = 'cancelada';
      return { mensagem: `Reserva para a mesa ${this.numeMesa} foi cancelada.` };
    }
    return { mensagem: `Reserva não pode ser cancelada, pois já está ${this.statusMesa}` };
  }


  LiberarMesa() {
    console.log('Status atual da mesa:', this.statusMesa);
    if (this.statusMesa === 'confirmada') {
      this.statusAnterior = this.statusMesa; // 👈 Salva status anterior
      this.statusMesa = 'livre';
      return { mensagem: `Mesa ${this.numeMesa} liberada com sucesso.` };
    }
    return { mensagem: `Mesa não está confirmada, status atual: ${this.statusMesa}` };
  }

  validate() {
    const errors = [];

    const dataValida = parseDiaMesAno(this.data);
    if (!dataValida) {
      errors.push("A data é obrigatória e deve estar no formato DD/MM/AAAA.");
    } else {
      const anoAtual = new Date().getFullYear();
      if (dataValida.getFullYear() > anoAtual) {
        errors.push(`O ano da reserva não pode ser superior a ${anoAtual}.`);
      }
    }

    if (!this.hora) errors.push("A hora é obrigatória.");

    if (!Number.isInteger(this.numeMesa) || this.numeMesa <= 0) {
      errors.push("O número da mesa precisa ser um número inteiro e maior que 0.");
    }

    if (!Number.isInteger(this.quantPessoas) || this.quantPessoas <= 0) {
      errors.push("A quantidade de pessoas precisa ser um número inteiro e maior que 0.");
    }

    if (!this.nomeRespons || this.nomeRespons.trim().length < 3) {
      errors.push("O nome do responsável deve ter pelo menos 3 caracteres.");
    }

    if (errors.length > 0) return { valid: false, errors };
    return { valid: true };
  }
}

export default Reserva;
