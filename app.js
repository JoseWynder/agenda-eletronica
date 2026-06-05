const express = require('express');

function createApp() {
  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  app.get('/', (req, res) => {
    res.json({
      message: 'API da Agenda Eletrônica'
    });
  });

  app.use((req, res) => {
    res.status(404).json({
      error: 'Rota não encontrada'
    });
  });

  app.use((error, req, res, next) => {
    console.error(error);

    if (res.headersSent) {
      return next(error);
    }

    return res.status(500).json({
      error: 'Erro interno do servidor'
    });
  });

  return app;
}

module.exports = createApp;
