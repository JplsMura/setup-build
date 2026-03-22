import axios from 'axios';

// Instância base do Axios
export const api = axios.create({
  baseURL: '/api', 
  withCredentials: true, // Adiciona envio obrigatório do Cookie CSRF
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
});

// CSRF Token e Error Interceptors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Interceptor global para tratar Unauthorized (Sessão Expirada ou Não Logado)
    if (error.response?.status === 401) {
      console.warn("Usuário não autenticado.");
      // Redirecionamento poderia ser feito aqui, mas deixaremos para os hooks do React Query
    }

    // CSRF token mismatch 
    if (error.response?.status === 419) {
      console.warn("Sessão HTTP do Sanctum expirou. O Request falhou.");
    }
    
    return Promise.reject(error);
  }
);
