# Kyros Intelligence (AIA)

Kyros Platform é uma plataforma criada a partir do [Virtual Assistant](https://github.com/navigateconsulting/virtual-assistant).

- Angular Ui - Para interface web para gerenciar um bot.
- Python API gateway - Conecta ao rasa para treinar e fazer deploy do bot em um server.
- Mongodb - Para armazenamento das informações dos bots.

### Using Rasa

Nos usamos a versão rasa = 1.3.1 e rasa-sdk = 1.3.2 pois tem suporte e mais estabilidade para algumas operações, atualmente já existem versões superiores que podem ser implementadas em um bot, mas é necessario testar em uma branch separada.

Em especial o rasa 1.3.1 tem suporte a response, mas que não esta sendo utilizado nessa plataforma.

O rasa-sdk 1.3.2 foi escolhido pois o 1.3.1 tem problemas no formulário. (rasa-sdk não pode ter versão muito maior do que a do rasa)

## 1. Installation 

   Instruções para instalação [click here](installation/Readme.md)

## 2. Usage

   Instruções de uso: [click here](usage/Readme.md)
