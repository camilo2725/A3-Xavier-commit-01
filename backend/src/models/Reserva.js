class Reserva{
    constructor({data, hora, numeMesa, quantPessoas, nomeRespons, statusMesa}){
    this.data = data;
    this.hora = hora;
    this.numeMesa = numeMesa;
    this.quantPessoas = quantPessoas;
    this.nomeRespons = nomeRespons;
    this.statusMesa = 'reservada';
  }

    ConfReserv(){
      if(this.statusMesa ==='reservada '){ 
        this.statusMesa = 'confimada';
        return  {mensagem: `Mesa "${this.numeMesa}"confirmada com sucesso!` };
      }
      return {mensagem: `Reserva não pode ser concluida, porque a mesa já está `+ this.statusMesa };
    }
    CancelReserv(){
      if(this.statusMesa === 'reservada' || this.statusMesa === 'confirmada'){
        this.statusMesa = 'cancelada';
        return{mensagem: `Reserva para a mesa ${this.numeMesa} foi cancelada`};
      }

        return{mensagem: `Reserva não pode ser cancelada, por conta de já está ` +this.statusMesa}

    }
    
    validate(){
      const errors = []
      
      if(!this.data){
        errors.push("A data é obrigatoria.");
      }

      if(!this.hora){
        errors.push("A hora é obrigatoria.");
      }

      if(!Number.isInt(this.numeMesa) || this.numeroMesa <= 0){
        errors.push("O numero da mesa precisa ser um numero inteiro e positivo e maior que 0.")
      }

      if(!Number.isInt(this.quantPessoas) || this.quantPessoas <=0 ){
        errors.push("A quantidade de pessoas precisa ser um numero inteiro e positivo e maior que 0.")
      }

      if(!this.nomeRespons || this.nomeRespons.trim().length < 3){
        errors.push("O nome do responsável deve ter pelo menos 3 caracteres.")
      }
      
      if(errors.length > 0){
        return {valid: false, errors};  
      }

      return {valid:true}
    }
}
export default Reserva