# Build stage
FROM node:20 AS build-stage
WORKDIR /client
COPY package*.json ./
COPY .env ./
RUN npm install
COPY . .
RUN npm run build

# Production stage
FROM nginx:stable-alpine
COPY --from=build-stage /client/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]