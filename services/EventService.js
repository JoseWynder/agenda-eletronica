const { ObjectId } = require('mongodb');
const { logError } = require('../utils/logger');

class EventService {
  constructor(eventRepository) {
    this.eventRepository = eventRepository;
  }

  validate(data) {
    if (!data.title || data.title.trim() === '') {
      throw new Error('Titulo e obrigatorio');
    }

    if (data.description !== undefined && data.description !== null) {
      if (typeof data.description !== 'string') {
        throw new Error('Descricao deve ser uma string');
      }

      if (data.description.trim() === '') {
        throw new Error('Descricao nao pode ser vazia');
      }
    }

    if (!data.startTime || !data.endTime) {
      throw new Error('Datas sao obrigatorias');
    }

    const startTime = new Date(data.startTime);
    const endTime = new Date(data.endTime);

    if (isNaN(startTime) || isNaN(endTime)) {
      throw new Error('Data invalida');
    }

    if (startTime >= endTime) {
      throw new Error('Data de inicio deve ser menor que a de fim');
    }

    if (!data.calendarId) {
      throw new Error('calendarId e obrigatorio');
    }
  }

  async createEvent(data) {
    try {
      this.validate(data);

      const startTime = new Date(data.startTime);
      const endTime = new Date(data.endTime);

      const conflict = await this.eventRepository.hasConflict(
        data.calendarId,
        startTime,
        endTime
      );

      if (conflict) {
        throw new Error('Conflito de horario detectado');
      }

      const event = {
        title: data.title,
        description: data.description || null,
        startTime,
        endTime,
        calendarId: new ObjectId(data.calendarId),
        createdAt: new Date()
      };

      return await this.eventRepository.create(event);
    } catch (error) {
      logError(error, 'EventService.createEvent', {
        title: data.title,
        calendarId: data.calendarId
      });
      throw error;
    }
  }

  async updateEvent(id, data) {
    try {
      const existing = await this.eventRepository.findById(id);

      if (!existing) {
        throw new Error('Evento nao encontrado');
      }

      const updatedEvent = {
        ...existing,
        ...data
      };

      this.validate(updatedEvent);

      const startTime = new Date(updatedEvent.startTime);
      const endTime = new Date(updatedEvent.endTime);

      const conflict = await this.eventRepository.hasConflict(
        existing.calendarId,
        startTime,
        endTime,
        id
      );

      if (conflict) {
        throw new Error('Conflito de horario detectado');
      }

      return await this.eventRepository.updateById(id, {
        title: updatedEvent.title,
        description: updatedEvent.description,
        startTime,
        endTime
      });
    } catch (error) {
      logError(error, 'EventService.updateEvent');
      throw error;
    }
  }

  async getEventsByCalendar(calendarId) {
    try {
      return await this.eventRepository.findByCalendarId(calendarId);
    } catch (error) {
      logError(error, 'EventService.getEventsByCalendar');
      throw error;
    }
  }

  async deleteEvent(id) {
    try {
      return await this.eventRepository.deleteById(id);
    } catch (error) {
      logError(error, 'EventService.deleteEvent');
      throw error;
    }
  }
}

module.exports = EventService;
