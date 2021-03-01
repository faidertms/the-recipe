# The Recipe - Delivery Much fullstack Desafio

Este projeto foi realizado para o desafio da Delivery Much.  

## Esse projeto usa :sparkles: 
:heavy_check_mark: Javascript(ES6+)    
:heavy_check_mark: TypeScript   
:heavy_check_mark: React(CRA)  
:heavy_check_mark: Laravel(PHP 7.4+)  
:heavy_check_mark: Giphy API  
:heavy_check_mark: RecipePuppy API  
:heavy_check_mark: Docker   
:heavy_check_mark: PHPUnit  

## Outras informações

- Toda aplicação Front ou Back End está inglês
- A interface visual foi feita apenas com css puro, sem ajuda de frameworks como bootstrap/tailwind.
- As bibliotecas usada no front-end foi axios, react-icons e react-toastify. Esse último foi para mostrar a mensagem de erro do servidor, tanto validação como falha no acesso a api's externas.
- No front-end apenas faltou a parte de paginação, porém não deu tempo :pensive:. Possivelmente amanhã farei em uma branch separada caso vocês liberem irei fazer o merge :hugs:.
- Caso queira acessar o site em execução na minha hospedagem [http://therecipe.thiagotms.tech](http://therecipe.thiagotms.tech)!
- Não utilizei volumes/bind volumes no docker do projeto. Apesar de deixar um docker-compose quase pronto em termos de desenvolvimento faltando apenas os volumes.
- Foi configurado e usado typescript para o front-end
- A aplicação roda na porta 8081

## Como iniciar o projeto em production

### Build da imagem Docker

Primeiro clone o projeto em uma pasta de sua escolha.  
Após essa etapa, na raiz do projeto você deverá criar um .env igual do laravel(/back-end/.env.example) e adicione sua chave do giphy(<b>GIPHY_API_KEY</b>), que pode ser criado em(https://developers.giphy.com/docs/sdk).

Depois de preparar o .env na raiz do projeto, faça build do Dockerfile com os seguintes comandos:  

```
docker build --target backend-production --tag backend-php-fpm-the-recipe:1.0 .
docker build --target backend-nginx --tag backend-nginx-the-recipe:1.0 .
```

O build é feito com abordagem de multi-stage, logo apenas um Dockerfile otimizado que pode ser usado para cada ambiente. Nesse caso é usado o ambiente de produção, caso queira alterar utilizar o target como backend-development. O nome da imagem pode ser alterado caso deseje.  

### Iniciando os containers

Após realizar o build das imagens, e necessario iniciar os containers. Como foi usado o PHP-FPM em conjunto com NGINX que atuará como proxy, sendo necessario criar um 'network' antes para comunicação entre os containers. Logo utilize os seguinte comandos:  

```
docker network create netrecipe
docker run -d --rm --net netrecipe --name app --env-file=.env backend-php-fpm-the-recipe:1.0
docker run -d --rm --net netrecipe --name nginx -p 8081:80 backend-nginx-the-recipe:1.0
```
  
A aplicação rodará na <b>porta 8081</b> pronta para ser consumida e visualizada. 

A parte do front-end ja está compilada e adicionada no laravel para que ele possa servir os arquivos estáticos do site. Normalmente eu iria servir as duas aplicações separadas, ou seja teria mais containers :anguished:, mas como o front-end só tem uma única página aproveitei para reutilizar a rota criada por padrão do laravel(view: welcome.blade.php), substituindo o html gerado no front-end para o arquivo da view citada. Os outros arquivos estáticos como js/css foram copiadas para pasta public. Todo esse processo você pode ver no dockerfile.  


### Parando os containers

Caso deseje parar os containers, que por padrão já deleta o container assim que são parados devido a option --rm, basta usar os seguintes comandos:  

```
docker stop nginx
docker stop app
docker network rm netrecipe
```

## Como iniciar o projeto para teste(PHPUnit)

Processo é bastante semelhante ao de cima, a unica alteração é o target para gerar a imagem do backend. 

Você irá trocar o target dessa linha por 'backend-development':  

```
docker build --target backend-production --tag backend-php-fpm-the-recipe:1.0 .  
```

Logo alterando o target, aproveitei também para mudar o nome da imagem/container e o workdir, ficando todo processo para executar o teste:  

```
docker build --target backend-development --tag backend-dev-php-fpm-the-recipe:1.0 .
docker run -d --rm --name app-dev --workdir /var/www --env-file=.env backend-dev-php-fpm-the-recipe:1.0
docker exec app-dev php artisan test
docker stop app-dev
```

O teste deverá ser executado normalmente, mostrando o resultado do teste no terminal, ao final do processo é finalizado o container.

## Como iniciar o projeto para desenvolvimento(docker-compose)

Para desenvolvimento recomendo utilizar o docker-compose, no qual já está configurado os volumes para o front-end e o back-end. Qualquer alteração nos arquivos do projeto(na maquina host) será refletido automaticamente no container. Essas configurações estão no arquivo docker-compose.yaml.  

```
docker-compose up
```
Para acessar as aplicações separadamente:  
Front-end: [http://localhost:8082](http://localhost:8082)  
Back-end: [http://localhost:8000](http://localhost:8000)

