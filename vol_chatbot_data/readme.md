### Volume Rasa

Os arquivos contidos nesse diretorio são acessados pela API gateway para criação de um bot inicial.

#### rasa

A pasta rasa possui arquivos para configurações iniciais como:

 - actions. py 
 - endpoints.yml
 - credentials.yml

São arquivos que podem ser editados, mas para que se façam validas as alterações o software deve ser resetado e o bot também precisa ser criado novamente a partir dos novos arquivos.

#### seed_data

O seed data possui arquivos para criação da NLU do bot e juntamente um diretorio de backup chamado Base Domain.

 - intents.json   (arquivos de intenções da NLU)
 - responses.json (arquivos de respostas do bot)
 - stories.json   (arquivo de stories ou roteiros para o bot)
 - actions.json   (ações que contem cadastro das ações do servidor de ações)
 - slots.json     (arquivo que contem definições para criar slots de memoria)
 - projects.json  (arquivo que possui o nome do projeto)
 - entities.json  (arquivo que possui entidades para serem identificadas nas intents)

Os arquivos escritos em json são convertidos em markdown para que o bot base possa ser treinado. As alterações podem ser feitas no json para que seja possivel usar um novo bot ou melhorar. 

#### temp

O diretorio temp tem os arquivos de bots que foram treinados.
