import api from './axiosClient'; // já configurado com baseURL


const API_URL = 'http://localhost:3001/api';

export async function buscarReservas() {
    const response = await fetch(`${API_URL}/reserva`);
    if (!response.ok) throw new Error('Erro ao buscar reservas');
    return await response.json();
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
