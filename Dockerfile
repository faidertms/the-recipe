#Usando abordagem de multistage para otimizar a geração de imagem
FROM composer AS vendor-base
WORKDIR /var/www
COPY ./back-end/composer.* ./

#Gerando a pasta Vendor para development
FROM vendor-base AS vendor-dev
RUN composer install \
    --ignore-platform-reqs \
    --no-ansi \
    --no-autoloader \
    --no-interaction \
    --no-scripts

COPY ./back-end ./
RUN composer dump-autoload --optimize --classmap-authoritative

#Gerando a pasta Vendor para otimizado para produção
FROM vendor-base AS vendor-prod
RUN composer install \
    --ignore-platform-reqs \
    --no-ansi \
    --no-dev \
    --no-autoloader \
    --no-interaction \
    --no-scripts

COPY ./back-end ./
RUN composer dump-autoload --optimize --no-dev --classmap-authoritative

# Gerando imagem para o frontend, vale ressaltar que essa imagem é pra dev ou build. Nesse caso quem vai servir a versão de prod é o laravel.
FROM node:alpine as frontend
WORKDIR /app
COPY ./front-end/package*.json ./
RUN npm install
COPY ./front-end ./
RUN npm run build
EXPOSE 3000
CMD [ "npm", "start" ]

#Gera imagem otimizada para development
FROM php:fpm-alpine as backend-development
COPY ./back-end /var/www
COPY --from=vendor-dev /var/www/vendor /var/www/vendor
COPY --from=frontend /app/build /var/www/public
#Aproveitando a rota já criada por padrão do laravel, em casos mais complexos essa abordagem não funcionaria
COPY --from=frontend /app/build/index.html /var/www/resources/views/welcome.blade.php
RUN chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache

#Gera imagem otimizada para produção
FROM php:fpm-alpine as backend-production
COPY ./back-end /var/www
COPY --from=vendor-prod /var/www/vendor /var/www/vendor
COPY --from=frontend /app/build /var/www/public
#Aproveitando a rota já criada por padrão do laravel, em casos mais complexos essa abordagem não funcionaria
COPY --from=frontend /app/build/index.html /var/www/resources/views/welcome.blade.php
RUN chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache

#Gera o nginx para ficar como proxy para o php-fpm que oferece melhor performance
FROM nginx:alpine as backend-nginx
COPY ./back-end /var/www
COPY --from=frontend /app/build /var/www/public
COPY ./nginx/backend.conf /etc/nginx/conf.d/