class Reserva {
  constructor({ data, hora, numeMesa, quantPessoas, nomeRespons, statusMesa }) {
    this.data = data;
    this.hora = hora;
    this.numeMesa = numeMesa;
    this.quantPessoas = quantPessoas;
    this.nomeRespons = nomeRespons;
    this.statusMesa = statusMesa || 'reservada';
  }

  confirmar() {
    if (this.statusMesa === 'reservada') {
      this.statusMesa = 'confirmada';
      return { mensagem: `Mesa "${this.numeMesa}" confirmada com sucesso!` };
    }
    return { mensagem: `Reserva não pode ser concluída, porque a mesa já está ${this.statusMesa}` };
  }

  cancelar() {
    if (this.statusMesa === 'reservada' || this.statusMesa === 'confirmada') {
      this.statusMesa = 'cancelada';
      return { mensagem: `Reserva para a mesa ${this.numeMesa} foi cancelada.` };
    }
    return { mensagem: `Reserva não pode ser cancelada, pois já está ${this.statusMesa}` };
  }


  LiberarMesa() {
    if (this.statusMesa === 'confirmada') {
      this.statusMesa = 'livre';
      return { mensagem: `Mesa ${this.numeMesa} liberada com sucesso.` };
    }
    return { mensagem: `Mesa não está confirmada, status atual: ${this.statusMesa}` };
  }


  validate() {
    const errors = [];

    if (!this.data) errors.push("A data é obrigatória.");
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
