const { formatCalendar } = require('../utils/formatters');

function createCalendarController({ calendarService }) {
  return {
    listMine: async (req, res) => {
      try {
        const calendars = await calendarService.getCalendarsByUser(
          req.session.user.id
        );

        return res.json({
          calendars: calendars.map(formatCalendar)
        });
      } catch (error) {
        return res.status(500).json({ error: error.message });
      }
    },

    getById: async (req, res) => {
      try {
        const calendar = await calendarService.getCalendarById(req.params.id);

        if (!calendar) {
          return res.status(404).json({ error: 'Calendário não encontrado' });
        }

        if (calendar.userId.toString() !== req.session.user.id) {
          return res.status(403).json({ error: 'Acesso negado' });
        }

        return res.json({
          calendar: formatCalendar(calendar)
        });
      } catch (error) {
        return res.status(500).json({ error: error.message });
      }
    },

    create: async (req, res) => {
      try {
        const result = await calendarService.createCalendar({
          name: req.body.name,
          userId: req.session.user.id
        });
        const calendar = await calendarService.getCalendarById(result.insertedId);

        return res.status(201).json({
          message: 'Calendário criado com sucesso',
          calendar: formatCalendar(calendar)
        });
      } catch (error) {
        return res.status(400).json({ error: error.message });
      }
    },

    update: async (req, res) => {
      try {
        const current = await calendarService.getCalendarById(req.params.id);

        if (!current) {
          return res.status(404).json({ error: 'Calendário não encontrado' });
        }

        if (current.userId.toString() !== req.session.user.id) {
          return res.status(403).json({ error: 'Acesso negado' });
        }

        const result = await calendarService.updateCalendar(req.params.id, {
          name: req.body.name
        });

        if (!result.matchedCount) {
          return res.status(404).json({ error: 'Calendário não encontrado' });
        }

        const calendar = await calendarService.getCalendarById(req.params.id);

        return res.json({
          message: 'Calendário atualizado com sucesso',
          calendar: formatCalendar(calendar)
        });
      } catch (error) {
        return res.status(400).json({ error: error.message });
      }
    },

    remove: async (req, res) => {
      try {
        const current = await calendarService.getCalendarById(req.params.id);

        if (!current) {
          return res.status(404).json({ error: 'Calendário não encontrado' });
        }

        if (current.userId.toString() !== req.session.user.id) {
          return res.status(403).json({ error: 'Acesso negado' });
        }

        const result = await calendarService.deleteCalendar(req.params.id);

        if (!result.deletedCount) {
          return res.status(404).json({ error: 'Calendário não encontrado' });
        }

        return res.json({
          message: 'Calendário removido com sucesso'
        });
      } catch (error) {
        return res.status(400).json({ error: error.message });
      }
    }
  };
}

module.exports = createCalendarController;
