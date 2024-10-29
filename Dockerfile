# Etapa de build
FROM node:18 AS build
WORKDIR /app

# Copia y instala las dependencias
COPY package.json yarn.lock ./
RUN yarn install

# Instala TypeScript globalmente
RUN yarn add typescript -D

# Copia el resto de los archivos de la aplicación
COPY . .

# Corre el build
RUN yarn build

# Etapa de producción con Nginx
FROM nginx:alpine
# Copia los archivos de la aplicación
COPY --from=build /app/dist /usr/share/nginx/html
# Copia el archivo de configuración personalizado de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
