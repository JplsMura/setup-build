import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true,       // Ouve em todos os endereços da rede docker
    port: 3000,
    proxy: {
      // Redireciona chamadas /api para o backend Laravel no Nginx
      '^/api': {
        target: 'http://web:8000',
        changeOrigin: true,
        headers: {
          Accept: 'application/json',
        }
      },
      // Necessário para inicialização correta do Sanctum
      '^/sanctum/csrf-cookie': {
        target: 'http://web:8000',
        changeOrigin: true,
      }
    }
  }
});
