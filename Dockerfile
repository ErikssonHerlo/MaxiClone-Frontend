# Etapa de build
FROM node:18 AS build
WORKDIR /app
COPY package.json ./
RUN yarn install
COPY . .
RUN yarn build

# Etapa de producción con Nginx
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
