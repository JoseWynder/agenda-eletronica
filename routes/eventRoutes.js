const express = require('express');
const createEventController = require('../controllers/eventController');
const requireAuth = require('../middlewares/requireAuth');
const {
  validateObjectIdParam,
  validateObjectIdBody
} = require('../middlewares/validateObjectId');

function createEventRoutes(deps) {
  const router = express.Router();
  const controller = createEventController(deps);

  router.use(requireAuth);
  router.get('/calendar/:calendarId', validateObjectIdParam('calendarId'), controller.listByCalendar);
  router.post('/', validateObjectIdBody('calendarId'), controller.create);
  router.get('/:id', validateObjectIdParam('id'), controller.getById);
  router.put('/:id', validateObjectIdParam('id'), controller.update);
  router.delete('/:id', validateObjectIdParam('id'), controller.remove);

  return router;
}

module.exports = createEventRoutes;
