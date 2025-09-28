# 🧱 Build Stage
FROM node:20 AS build-stage

WORKDIR /server

# Copia solo i file necessari per installare le dipendenze
COPY package*.json ./
RUN npm ci

# Copia il resto del codice sorgente
COPY . .

# Build dell'app NestJS
RUN npm run build

# 🧪 Runtime Stage (Alpine + build tools per bcrypt)
FROM node:20-alpine AS production-stage

# Installa strumenti necessari per moduli nativi (es. bcrypt)
RUN apk add --no-cache python3 make g++

WORKDIR /server

# Copia solo ciò che serve per il runtime
COPY package*.json ./
COPY .env.production.local .env

# Installa solo le dipendenze di produzione
RUN npm ci --omit=dev

# Copia il codice compilato
COPY --from=build-stage /server/dist ./dist

# Espone la porta dell'app NestJS
EXPOSE 3000

# Avvia l'app
CMD ["node", "dist/main"]