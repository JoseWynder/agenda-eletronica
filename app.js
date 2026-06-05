const express = require('express');
const session = require('express-session');

const createAuthRoutes = require('./routes/authRoutes');
const createUserRoutes = require('./routes/userRoutes');
const createCalendarRoutes = require('./routes/calendarRoutes');
const createEventRoutes = require('./routes/eventRoutes');

function createApp(deps) {
  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(
    session({
      secret: 'agenda-eletronica-secret',
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: false
      }
    })
  );

  app.get('/', (req, res) => {
    res.json({
      message: 'API da Agenda Eletrônica',
      authenticated: !!(req.session && req.session.user),
      user: req.session && req.session.user ? req.session.user : null
    });
  });

  app.use('/auth', createAuthRoutes(deps));
  app.use('/users', createUserRoutes(deps));
  app.use('/calendars', createCalendarRoutes(deps));
  app.use('/events', createEventRoutes(deps));

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
