FROM node:18-alpine

WORKDIR /app

COPY backend/package*.json ./backend/
RUN cd backend && npm ci --only=production

COPY backend ./backend

EXPOSE 5000

CMD ["node", "backend/src/server.js"]
