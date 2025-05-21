import Reserva from "../models/Reserva";

class ControleReserva{
    async create(req, res){
        try{
            const reserva = new Reserva(req.body);
            const{valid, errors} = reserva.validate();
            
            if(!valid) {
                return handleError(res, errors, 400, 'Erro de validação');
            }
        }catch(error){
           return handleError(res, error.mensagem);
        }
    }
    
    async confirm(req, res){
        try{
            const{numeMesa} = req.params;
            const reserva = await Reserva.findbyMesa(numeMesa);

            if(!reserva){
                return handleError(res, `Reserva para a mesa ${numeMesa} não encontrada`, 404, 'Não encontrado');
            }

            const resultado = reserva.ConfReserv();
            
            if(resultado.mensagem.includes ('sucesso')){
                return res.json({mensagem: `Reserva foi confirmada para a mesa ${reserva.numeMesa}.`});
            }

            return handleError(res, resultado.mensagem, 400,'Falha ao confirmar reserva');
        
        } catch(error){
            return handleError(res, error.mensagem);
        }
    }

    async cancel(req, res){
        try{
            const{numeMesa} = req.params;
            const reserva = await Reserva.findbyMesa(numeMesa);

            if(!reserva){
                return handleError(res, `Reserva para a mesa ${numeMesa} não encontrada`, 404, 'Não encontrado');
            }

            const resultado = reserva.CancelReserv();
            
            if(resultado.mensagem.includes ('sucesso')){
                return res.json({mensagem: `Reserva para a mesa ${reserva.numeMesa} foi cancelada.`});
        
        }

            return handleError (res, resultado.mensagem, 400, 'Falha ao cancelar reserva');

    }catch(error){
            return handleError(res, error.mensagem);
        }
    }
}

function handleError(res, detail = 'An error has occurred.', status = 500, message = 'Internal Server Error') {
    console.log(`Error: ${message} - ${detail}`);
    if (!res.headersSent) {
        return res.status(status).json({ message, detail });
    }
}

export default new ControleReserva();