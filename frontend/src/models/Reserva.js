import { parseDiaMesAno } from '../utils/dateUtils';

class Reserva {
  constructor({ id, data, hora, numeMesa, quantPessoas, nomeRespons, statusMesa, statusAnterior = "", garcomResponsavel = "" }) {
    this.id = id;
    this.data = data;
    this.hora = hora;
    this.numeMesa = numeMesa;
    this.quantPessoas = quantPessoas;
    this.nomeRespons = nomeRespons;
    this.statusMesa = statusMesa || 'reservada';
    this.statusAnterior = statusAnterior;
    this.garcomResponsavel = garcomResponsavel;
  }

  static criarReserva(dados) {
    const novaReserva = new Reserva({
      ...dados,
      numeMesa: parseInt(dados.numeMesa),
      quantPessoas: parseInt(dados.quantPessoas),
    });

    const { valid, errors } = novaReserva.validate();
    if (!valid) {
      return { sucesso: false, mensagem: errors.join('\n') };
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
    const dataOriginalObj = new Date(this.data);
    const dataInformadaObj = new Date(data);
    
    if (isNaN(dataOriginalObj) || isNaN(dataInformadaObj)) {
      return { mensagem: "Data inválida para cancelamento." };
    }

    const dataOriginal = dataOriginalObj.toDateString();
    const dataInformada = dataInformadaObj.toDateString();

    if (dataOriginal !== dataInformada || this.hora !== hora) {
      return { mensagem: "Não foi possível confirmar o cancelamento da reserva em razão da discrepância dos dados." };
    }

    if (this.statusMesa === 'reservada' || this.statusMesa === 'confirmada') {
      this.statusMesa = 'cancelada';
      return { mensagem: `Reserva para a mesa ${this.numeMesa} foi cancelada.` };
    }

    return { mensagem: `Reserva não pode ser cancelada, pois já está ${this.statusMesa}` };
  }

  LiberarMesa() {
    if (this.statusMesa === 'confirmada') {
      this.statusAnterior = this.statusMesa;
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

    if (!Number.isInteger(this.numeMesa) || this.numeMesa < 1 || this.numeMesa > 10) {
      errors.push("O número da mesa precisa ser um número inteiro entre 1 e 10.");
    }

    if (!Number.isInteger(this.quantPessoas) || this.quantPessoas < 1 || this.quantPessoas > 10) {
      errors.push("A quantidade de pessoas precisa ser um número inteiro entre 1 e 10.");
    }

    if (!this.nomeRespons || this.nomeRespons.trim().length < 3) {
      errors.push("O nome do responsável deve ter pelo menos 3 caracteres.");
    }

    if (errors.length > 0) return { valid: false, errors };
    return { valid: true };
  }


  toJSON() {
    return {
      id: this.id,
      data: this.data,
      hora: this.hora,
      numeMesa: this.numeMesa,
      quantPessoas: this.quantPessoas,
      nomeRespons: this.nomeRespons,
      statusMesa: this.statusMesa,
      statusAnterior: this.statusAnterior,
      garcomResponsavel: this.garcomResponsavel,
    };
  }

}





export default Reserva;
