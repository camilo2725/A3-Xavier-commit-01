import db from '../services/db';

const verifDispoMesa = async (numeroMesa, data) => {
    try{

        const reservaExist = await db ('reservas')
            .where({ numeroMesa, data })
            .first();

        return !reservaExist;

    }catch(error){
        console.error("Erro na verificação da disponibilidade da mesa", error);
        throw error;
    }
}

export default verifDispoMesa