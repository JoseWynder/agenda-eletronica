const { formatEvent } = require('../utils/formatters');

function createEventController({ eventService, calendarService }) {
  return {
    listByCalendar: async (req, res) => {
      try {
        const calendar = await calendarService.getCalendarById(req.params.calendarId);

        if (!calendar) {
          return res.status(404).json({ error: 'Calendário não encontrado' });
        }

        if (calendar.userId.toString() !== req.session.user.id) {
          return res.status(403).json({ error: 'Acesso negado' });
        }

        const events = await eventService.getEventsByCalendar(req.params.calendarId);

        return res.json({
          events: events.map(formatEvent)
        });
      } catch (error) {
        return res.status(500).json({ error: error.message });
      }
    },

    getById: async (req, res) => {
      try {
        const event = await eventService.getEventById(req.params.id);

        if (!event) {
          return res.status(404).json({ error: 'Evento não encontrado' });
        }

        const calendar = await calendarService.getCalendarById(event.calendarId);

        if (!calendar || calendar.userId.toString() !== req.session.user.id) {
          return res.status(403).json({ error: 'Acesso negado' });
        }

        return res.json({
          event: formatEvent(event)
        });
      } catch (error) {
        return res.status(500).json({ error: error.message });
      }
    },

    create: async (req, res) => {
      try {
        const calendar = await calendarService.getCalendarById(req.body.calendarId);

        if (!calendar) {
          return res.status(404).json({ error: 'Calendário não encontrado' });
        }

        if (calendar.userId.toString() !== req.session.user.id) {
          return res.status(403).json({ error: 'Acesso negado' });
        }

        const result = await eventService.createEvent(req.body || {});
        const event = await eventService.getEventById(result.insertedId);

        return res.status(201).json({
          message: 'Evento criado com sucesso',
          event: formatEvent(event)
        });
      } catch (error) {
        return res.status(400).json({ error: error.message });
      }
    },

    update: async (req, res) => {
      try {
        const current = await eventService.getEventById(req.params.id);

        if (!current) {
          return res.status(404).json({ error: 'Evento não encontrado' });
        }

        const calendar = await calendarService.getCalendarById(current.calendarId);

        if (!calendar || calendar.userId.toString() !== req.session.user.id) {
          return res.status(403).json({ error: 'Acesso negado' });
        }

        const result = await eventService.updateEvent(req.params.id, req.body || {});

        if (!result.matchedCount) {
          return res.status(404).json({ error: 'Evento não encontrado' });
        }

        const event = await eventService.getEventById(req.params.id);

        return res.json({
          message: 'Evento atualizado com sucesso',
          event: formatEvent(event)
        });
      } catch (error) {
        return res.status(400).json({ error: error.message });
      }
    },

    remove: async (req, res) => {
      try {
        const current = await eventService.getEventById(req.params.id);

        if (!current) {
          return res.status(404).json({ error: 'Evento não encontrado' });
        }

        const calendar = await calendarService.getCalendarById(current.calendarId);

        if (!calendar || calendar.userId.toString() !== req.session.user.id) {
          return res.status(403).json({ error: 'Acesso negado' });
        }

        const result = await eventService.deleteEvent(req.params.id);

        if (!result.deletedCount) {
          return res.status(404).json({ error: 'Evento não encontrado' });
        }

        return res.json({
          message: 'Evento removido com sucesso'
        });
      } catch (error) {
        return res.status(400).json({ error: error.message });
      }
    }
  };
}

module.exports = createEventController;
