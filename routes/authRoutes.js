const express = require('express');
const createAuthController = require('../controllers/authController');

function createAuthRoutes(deps) {
  const router = express.Router();
  const controller = createAuthController(deps);

  router.post('/login', controller.login);
  router.post('/logout', controller.logout);
  router.get('/session', controller.session);

  return router;
}

module.exports = createAuthRoutes;
