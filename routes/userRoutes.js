const express = require('express');
const createUserController = require('../controllers/userController');
const requireAuth = require('../middlewares/requireAuth');
const { validateObjectIdParam } = require('../middlewares/validateObjectId');

function createUserRoutes(deps) {
  const router = express.Router();
  const controller = createUserController(deps);

  router.post('/', controller.create);
  router.get('/', requireAuth, controller.list);
  router.get('/:id', requireAuth, validateObjectIdParam('id'), controller.getById);
  router.put('/:id', requireAuth, validateObjectIdParam('id'), controller.update);
  router.delete('/:id', requireAuth, validateObjectIdParam('id'), controller.remove);

  return router;
}

module.exports = createUserRoutes;
