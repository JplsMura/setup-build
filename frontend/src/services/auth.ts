import { api } from './api';

export const AuthService = {
  // Busca o cookie CSRF inicial do Sanctum (Deve rodar no mount do app ou antes do login)
  initCsrf: async () => {
    return api.get('/sanctum/csrf-cookie', { baseURL: '/' });
  },
  
  // Buscar usuário autenticado
  getUser: async () => {
    const { data } = await api.get('/user');
    return data;
  },

  // Fazer o logout
  logout: async () => {
    await api.post('/logout');
  }
};
