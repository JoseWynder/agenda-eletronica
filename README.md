# Agenda Eletrônica

Projeto desenvolvido para a disciplina de Programação Web Back-End utilizando Node.js e MongoDB. A proposta é implementar uma biblioteca de acesso a dados para o domínio de agenda eletrônica, com foco no cadastro, consulta e validação de usuários, calendários e eventos.

## Estrutura do Projeto

O projeto foi organizado em camadas simples, separando responsabilidades:

* `models`: representa as entidades principais do domínio
* `repositories`: concentra o acesso direto ao MongoDB
* `services`: aplica validações e regras de negócio
* `database.js`: responsável pela conexão com o banco
* `index.js`: ponto de entrada principal do projeto
* `tests`: contém os testes manuais para validação dos fluxos
* `utils/logger.js`: registra exceções capturadas em arquivo

## Tecnologias Utilizadas

* JavaScript
* Node.js
* MongoDB
* Banco local em `mongodb://localhost:27017/mongo-test`

## Modelos e Regras de Negócio

### User

Campos:

* `name`
* `email`

Regras:

* `name` é obrigatório
* `email` é obrigatório
* `email` deve estar em formato válido
* não é permitido cadastrar dois usuários com o mesmo email
* no update, se `name` ou `email` forem informados, eles também passam por validação

### Calendar

Campos:

* `name`
* `userId`

Regras:

* `name` é obrigatório
* `userId` é obrigatório
* cada calendário deve estar associado a um usuário
* um mesmo usuário não pode ter dois calendários com o mesmo nome
* no update, o sistema também valida nome vazio e tentativa de atualização de calendário inexistente

### Event

Campos:

* `title`
* `description`
* `startTime`
* `endTime`
* `calendarId`

Regras:

* `title` é obrigatório
* `startTime` e `endTime` são obrigatórios
* `calendarId` é obrigatório
* `description` é opcional
* quando `description` for informada, ela não pode ser vazia
* `startTime` e `endTime` devem ser datas válidas
* a data de início deve ser menor que a data de fim
* não é permitido conflito de horário entre eventos do mesmo calendário
* no update, o evento é validado novamente antes de ser persistido

## Tratamento de Erros

As exceções capturadas durante a execução são registradas em `logs/error.log`. O arquivo de log armazena:

* contexto da execução
* mensagem do erro
* stack trace

## Testes

Os testes são manuais e validam os principais fluxos de usuário, calendário e evento, incluindo:

* operações de criação e atualização
* validação de campos obrigatórios
* duplicidade de email e de nome de calendário
* datas e descrições inválidas
* conflito de horários
* atualização de registros inexistentes

Antes da execução, o banco é limpo, e as exceções são registradas em log.

## Execução

Comandos:

* `node index.js`: inicializa o projeto e valida a conexão com o banco
* `node tests/run-tests.js`: executa os testes manuais
* `npm test`: executa o mesmo runner manual de testes
