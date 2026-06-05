const express = require('express');
const createCalendarController = require('../controllers/calendarController');
const requireAuth = require('../middlewares/requireAuth');
const { validateObjectIdParam } = require('../middlewares/validateObjectId');

function createCalendarRoutes(deps) {
  const router = express.Router();
  const controller = createCalendarController(deps);

  router.use(requireAuth);
  router.get('/', controller.listMine);
  router.post('/', controller.create);
  router.get('/:id', validateObjectIdParam('id'), controller.getById);
  router.put('/:id', validateObjectIdParam('id'), controller.update);
  router.delete('/:id', validateObjectIdParam('id'), controller.remove);

  return router;
}

module.exports = createCalendarRoutes;
