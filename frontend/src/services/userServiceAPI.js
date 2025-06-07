import api from './axiosClient'; // já configurado com baseURL
import { formatarDataISO } from '../utils/dateUtils';

const API_URL = 'http://localhost:3001/api';

export async function buscarReservas() {
    try {
        const response = await api.get('/reservas'); 
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
        method: 'PUT', // ou PATCH, dependendo da sua rota
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
        return response.data; // { nome, email, senha, cargo }
    } catch (error) {
        throw error.response?.data?.erro || "Erro ao autenticar usuário.";
    }
}

export const confirmarReservaAPI = async (reservaId, nomeGarcom) => {
    try {
        const response = await api.post(`/reservas/${reservaId}/confirmar`, {
             nomeGarcom 
        });

        // Se a chamada deu certo, o axios retorna os dados em 'response.data'
        return response.data;

    } catch (error) {
        console.error('Erro ao confirmar reserva:', error);
        // Retorna um objeto de erro padronizado para o componente lidar
        return { 
            sucesso: false, 
            mensagem: error.response?.data?.mensagem || 'Falha na comunicação com o servidor' 
        };
    }
};