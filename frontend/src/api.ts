import axios from 'axios';

// Instância base do Axios configurada para acessar a API do Laravel no proxy local
export const api = axios.create({
  baseURL: '/api',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  },
  withCredentials: true // Crucial para o Laravel Sanctum enviar os cookies de sessão e CSRF
});

// CSRF Handshake obrigatorio do Laravel Sanctum antes de POST, PUT ou DELETE
export const csrf = () => axios.get('/sanctum/csrf-cookie', { baseURL: '/' });

// Interceptor para tratamento de erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 419) {
      console.log('Sessão expirada ou não autenticado.');
    }
    return Promise.reject(error);
  }
);
