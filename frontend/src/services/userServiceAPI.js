import api from './axiosClient';
import { formatarDataISO } from '../utils/dateUtils';

const API_URL = 'http://localhost:3001/api';

export async function buscarReservas() {
    try {
        const response = await api.get('/reserva');
        return response.data.map(reserva => ({
            ...reserva,
            data: formatarDataISO(reserva.data),
        }));
    } catch (error) {
        console.error("Erro ao buscar reservas:", error);
        return [];
    }
}

export async function criarReserva(data) {
    const response = await fetch(`${API_URL}/reserva`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    return await response.json();
}

export async function cancelarReserva(idReserva) {
    const response = await fetch(`${API_URL}/reserva/${idReserva}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ statusMesa: 'cancelada' }),
    });
    return await response.json();
}


export async function loginUsuario(email, senha) {
    try {
        const response = await api.get('/usuario', {
            params: { email, senha }
        });
        return response.data;
    } catch (error) {
        throw error.response?.data?.erro || "Erro ao autenticar usuário.";
    }
}

export const confirmarReservaAPI = async (reservaId, nomeGarcom) => {
    try {
        const response = await api.post(`/reserva/${reservaId}/confirmar`, {
            nomeGarcom
        });

        return response.data;

    } catch (error) {

        return {
            sucesso: false,
            mensagem: error.response?.data?.mensagem || 'Falha na comunicação com o servidor'
        };
    }
};
