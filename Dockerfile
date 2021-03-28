FROM composer AS vendor-base
WORKDIR /var/www/app
COPY ./back-end/composer.* ./

#Gerando a pasta Vendor para otimizado para produção
FROM vendor-base AS vendor-prod
RUN composer install --no-interaction \
    --no-plugins \
    --no-scripts \
    --no-dev \
    --no-autoloader \ 
    --ignore-platform-reqs
COPY ./back-end .
RUN composer dump-autoload --optimize --no-dev --ignore-platform-reqs --classmap-authoritative

#Gerando a pasta Vendor para otimizado para dev
FROM vendor-base AS vendor-dev
RUN composer install \
    --ignore-platform-reqs \
    --no-autoloader \
    --no-interaction 
COPY ./back-end .
RUN composer dump-autoload

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
COPY ./back-end /var/www/app
COPY --from=vendor-dev /var/www/app/vendor /var/www/app/vendor
COPY --from=frontend /app/build /var/www/app/public
#Aproveitando a rota já criada por padrão do laravel, em casos mais complexos essa abordagem não funcionaria
COPY --from=frontend /app/build/index.html /var/www/app/resources/views/welcome.blade.php
RUN chown -R www-data:www-data /var/www/app/storage /var/www/app/bootstrap/cache

#Gera imagem otimizada para produção
FROM php:fpm-alpine as backend-production
COPY ./back-end /var/www/app
COPY --from=vendor-prod /var/www/app/vendor /var/www/app/vendor
COPY --from=frontend /app/build /var/www/app/public
#Aproveitando a rota já criada por padrão do laravel, em casos mais complexos essa abordagem não funcionaria
COPY --from=frontend /app/build/index.html /var/www/app/resources/views/welcome.blade.php
RUN chown -R www-data:www-data /var/www/app/storage /var/www/app/bootstrap/cache

#Gera o nginx para ficar como proxy para o php-fpm que oferece melhor performance
FROM nginx:alpine as backend-nginx
COPY ./back-end /var/www/app
COPY --from=frontend /app/build /var/www/app/public
COPY ./nginx/backend.conf /etc/nginx/conf.d/default.conf