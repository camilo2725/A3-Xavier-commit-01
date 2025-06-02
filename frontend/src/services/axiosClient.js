import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3001/api', // atualize para porta 3001
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,
});

api.interceptors.response.use(
    response => response,
    error => {
        console.error('Erro na requisição:', error.response?.data || error.message);
        return Promise.reject(error);
    }
);

export default api;
