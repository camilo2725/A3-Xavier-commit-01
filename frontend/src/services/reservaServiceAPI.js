import axios from "axios";

const API_URL = "http://localhost:3001/api/reserva"; // ajuste se necessário

export const getReservas = async () => {
    const response = await fetch(API_URL);
    return response.json();
};

export async function criarReserva(reserva) {
    try {
        const response = await axios.post('http://localhost:3001/api/reserva', {
            data: reserva.data,
            hora: reserva.hora,
            numeMesa: parseInt(reserva.numeMesa),
            quantPessoas: parseInt(reserva.quantPessoas),
            nomeRespons: reserva.nomeRespons,
            statusMesa: reserva.statusMesa || 'reservada',
            usuario_id: reserva.usuarioId || null,
        });

        return response.data.dados; // ⬅ retorne o objeto real da reserva salva
    } catch (error) {
        console.error('Erro ao criar reserva:', error);
        throw error;
    }
}

export const atualizarReserva = async (id, dadosAtualizados) => {
    const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dadosAtualizados),
    });
    return response.json();
};
