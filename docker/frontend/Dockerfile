FROM node:20-alpine

WORKDIR /app

# Expondo a porta usada pelo Vite
EXPOSE 3000

# O comando de inicialização será passado via docker-compose ou localmente
CMD ["sh", "-c", "npm install && npm run dev -- --host 0.0.0.0 --port 3000"]
