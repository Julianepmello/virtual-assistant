# Details

## Applications details 

![Virtual Assistant](https://raw.githubusercontent.com/Julianepmello/virtual-assistant/master/docs/assets/Virtual%20Assistant%20Arch.jpg)


#### UI Component
A plataforma UI é o frameword web que faz o front end para aplicaçao do rasa. Foi desenvolvida em angular 7.
O angular pode ser instalado via npm, mas o docker ja instala um virtual machine com o UI instalado nela e rodando.
 
#### api gateway
 API gateway é uma API em python 3.7 que comunica com o Front e o banco de dados coletando informações dos sockets e construindo um Bot. Faz parte do conjunto de backand juntamente com os typescript do UI.

 Através da API gateway é possivel treinar, rodar actions e fazer deploy do bot.
 
#### MongoDB 
 O mongo é a instancia onde o banco de dados armazena parametros como as intenções, entidades, respostas, stories e são coletadas via API gateway para poder construir um bot ou atualizalo.
 
#### rasa 
 O rasa é um container publicado no docker hub. É a partir do rasa que a inteligencia classifica e responde intenções do usuario seguindo um fluxo de historias
 
#### rasa-sdk 
 O rasa-sdk é o responsavel por rodar as ações do bot. O Rasa se conecta a porta do server de ações e executa scripts em python que podem variar de acordo com a imaginaçõ do usuário.          
   

## Docker installation 

 Siga os passos do link para instalar o docker e docker-compose:
 [docker 18.09](https://docs.docker.com/install/)
 [docker-compose 1.24.0](https://docs.docker.com/compose/install/)

## Clone github repo 

Use os comandos para clonar o repositorio git e conseguir editar os scripts da plataforma e do bot.
    
            git clone https://github.com/Julianepmello/virtual-assistant.git
            cd virtual-assistant
            docker-compose build
            docker-compose up
    
Os containers do docker se abrem nas seguintes portas:
 - Serviço: Porta
 - Rasa Actions: 5055,
 - Rasa Server: 5005,
 - Mongodb: 27017,
 - UI AIA: 8080,
 - API gateway: 8089,

## Docker-compose files 

O repositório possui dois arquivos de docker-compose.
 - docker-compose.yml
 - docker-compose.devel.yml. 

docker-compose.yml é um arquivo que inicializa todas as plataformas.

            docker-compose build
            docker-compose up -d

docker-compose.devel.yml inicializa as aplicações de ui application, api gateway e database. 
Esse arquivo inicializa as plataformas de front para que possa desenvolver o front.    

            docker-compose -f docker-compose.devel.yml build
            docker-compose -f docker-compose.devel.yml up -d
    
Use esse compando para conferir os logs do container:

            docker-compose logs -f <container-name>

Use o comando para criar uma pasta fisica do container: 

            docker cp <container-name:/> <destino/pasta>

Webchat-widget é o arquivo onde fica o webchat de exemplo que pode ser usado com canal de conexão do bot.

## External Volumes

Todos os dados de treinamento gerados pelo aplicativo são armazenados na própria máquina / servidor local. Para isso, usamos volumes de montagem de ligação que contêm arquivos de configuração padrão, amostras de demonstração e arquivos de banco de dados.

A pasta vol_chatbot_data na base de instalação é um volume de montagem de ligação e é montada nos contêineres da janela de encaixeo local para isso pode ser alterado, mas assegure-se de modificar os arquivos de composição do docker para refletir o local modificado.

A pasta vol_chatbot_data / database / db contém os arquivos de banco de dados mongodb.

Nota: Não recomendamos alterar os volumes de montagem de ligação anexados aos contêineres do docker, pois isso pode interromper a funcionalidade. Para cada cliente, ofereceríamos flexibilidade para definir bots com funcionalidades diferentes. 


