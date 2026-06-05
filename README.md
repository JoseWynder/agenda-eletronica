# Agenda Eletrônica

Projeto desenvolvido para a disciplina de Programação Web Back-End.

A aplicação implementa uma agenda eletrônica com gerenciamento de usuários, calendários e eventos. O repositório reúne as entregas do Projeto 1 e Projeto 2 da disciplina, evoluindo de uma biblioteca de domímio para uma API REST que utiliza Express.js, autenticação por sessão e operações CRUD para usuários, calendários e eventos.

---

## Objetivos do Projeto

### Projeto 1

Implementação de uma biblioteca em Node.js para:

* acesso ao MongoDB;
* persistência de entidades do domínio;
* validação de regras de negócio;
* tratamento de exceções;
* registro de logs.

### Projeto 2

Evolução da solução para uma aplicação Web utilizando Express.js, adicionando:

* rotas HTTP;
* autenticação de usuários;
* controle de sessão;
* respostas em JSON;
* operações CRUD através da API.

---

## Arquitetura da Aplicação

A aplicação segue uma separação em camadas.

As requisições HTTP são recebidas pelas rotas e encaminhadas para os controllers. Os controllers utilizam os services para aplicar regras de negócio e validações. Os services acessam os repositories, responsáveis pela comunicação com o MongoDB.

```text
.
├── controllers
├── logs
├── middlewares
├── models
├── repositories
├── routes
├── services
├── tests
├── utils
├── app.js
├── database.js
└── index.js
```

### Responsabilidades

| Diretório    | Responsabilidade                         |
| ------------ | ---------------------------------------- |
| models       | Entidades do domínio                     |
| repositories | Persistência e consultas no MongoDB      |
| services     | Regras de negócio e validações           |
| controllers  | Tratamento das requisições HTTP          |
| routes       | Definição dos endpoints da API           |
| middlewares  | Autenticação e validações compartilhadas |
| utils        | Funções auxiliares e logging             |
| tests        | Testes manuais dos fluxos principais     |

---

## Tecnologias Utilizadas

* JavaScript
* Node.js
* Express.js
* MongoDB
* Express Session

---

## Modelo de Domínio

### User

Campos:

* name
* email
* password

Validações:

* nome obrigatório;
* email obrigatório e válido;
* senha obrigatória;
* email único.

### Calendar

Campos:

* name
* userId

Validações:

* nome obrigatório;
* usuário obrigatório;
* não permite calendários com o mesmo nome para um mesmo usuário.

### Event

Campos:

* title
* description
* startTime
* endTime
* calendarId

Validações:

* título obrigatório;
* datas obrigatórias e válidas;
* data inicial menor que data final;
* calendário obrigatório;
* não permite conflito de horário entre eventos do mesmo calendário.

---

## Autenticação

A API utiliza sessão para identificar usuários autenticados.

### Login

| Método | Rota        |
| ------ | ----------- |
| POST   | /auth/login |

```json
{
  "email": "jose@email.com",
  "password": "123456"
}
```

### Sessão Atual

| Método | Rota          |
| ------ | ------------- |
| GET    | /auth/session |

### Logout

| Método | Rota         |
| ------ | ------------ |
| POST   | /auth/logout |

---

## Endpoints

### Base

| Método | Rota |
| ------ | ---- |
| GET    | /    |

Retorna informações básicas da API e o estado da sessão atual.

#

### Usuários

| Método | Rota       |
| ------ | ---------- |
| POST   | /users     |
| GET    | /users     |
| GET    | /users/:id |
| PUT    | /users/:id |
| DELETE | /users/:id |

#### Exemplo de cadastro

```json
{
  "name": "Jose",
  "email": "jose@email.com",
  "password": "123456"
}
```

#

### Calendários

| Método | Rota           |
| ------ | -------------- |
| POST   | /calendars     |
| GET    | /calendars     |
| GET    | /calendars/:id |
| PUT    | /calendars/:id |
| DELETE | /calendars/:id |

#### Exemplo de cadastro

```json
{
  "name": "Pessoal"
}
```

Observação:

* o `userId` é obtido automaticamente da sessão autenticada;
* o retorno do cadastro contém o identificador do calendário criado.

#

### Eventos

| Método | Rota                         |
| ------ | ---------------------------- |
| POST   | /events                      |
| GET    | /events/calendar/:calendarId |
| GET    | /events/:id                  |
| PUT    | /events/:id                  |
| DELETE | /events/:id                  |

#### Exemplo de cadastro

```json
{
  "title": "Reunião",
  "description": "Reunião de alinhamento",
  "startTime": "2026-06-04T10:00:00.000Z",
  "endTime": "2026-06-04T11:00:00.000Z",
  "calendarId": "..."
}
```

Observação:

* o `calendarId` deve ser o identificador retornado ao criar um calendário;
* eventos com horários conflitantes no mesmo calendário não são permitidos.


---

## Fluxo de Utilização

1. Criar um usuário.
2. Realizar login.
3. Criar um calendário.
4. Utilizar o `calendarId` retornado para criar eventos.
5. Consultar, atualizar ou remover registros conforme necessário.

---

## Tratamento de Erros

O sistema realiza:

* validação de campos obrigatórios;
* validação de IDs;
* validação de regras de negócio;
* tratamento de exceções do MongoDB.

As exceções capturadas são registradas em:

```text
logs/error.log
```

## Execução

Instalação das dependências:

```bash
npm install
```

Inicialização da aplicação:

```bash
npm start
```

Servidor:

```text
http://localhost:3000
```

---

## Testes

Execução dos testes manuais:

```bash
npm test
```

Os testes cobrem:

* autenticação;
* CRUD de usuários;
* CRUD de calendários;
* CRUD de eventos;
* validações;
* conflitos de horário;
* persistência e tratamento de erros.

