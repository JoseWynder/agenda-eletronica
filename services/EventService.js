const { ObjectId } = require('mongodb');
const { logError } = require('../utils/logger');

class EventService {
  constructor(eventRepository, calendarRepository) {
    this.eventRepository = eventRepository;
    this.calendarRepository = calendarRepository;
  }

  validate(data) {
    if (!data.title || data.title.trim() === '') {
      throw new Error('Campo "title" é obrigatório');
    }

    if (data.description !== undefined && data.description !== null) {
      if (typeof data.description !== 'string') {
        throw new Error('Campo "description" deve ser uma string');
      }

      if (data.description.trim() === '') {
        throw new Error('Campo "description" não pode ser vazio');
      }
    }

    if (!data.startTime || !data.endTime) {
      throw new Error('Campos "startTime" e "endTime" são obrigatórios');
    }

    const startTime = new Date(data.startTime);
    const endTime = new Date(data.endTime);

    if (isNaN(startTime) || isNaN(endTime)) {
      throw new Error('Campos "startTime" e "endTime" devem ser datas válidas');
    }

    if (startTime >= endTime) {
      throw new Error('O campo "startTime" deve ser menor que "endTime"');
    }

    if (!data.calendarId) {
      throw new Error('Campo "calendarId" é obrigatório');
    }
  }

  async createEvent(data) {
    try {
      this.validate(data);

      if (!ObjectId.isValid(data.calendarId)) {
        throw new Error('Campo "calendarId" é inválido');
      }

      const calendar = await this.calendarRepository.findById(data.calendarId);

      if (!calendar) {
        throw new Error('Calendário não encontrado');
      }

      const startTime = new Date(data.startTime);
      const endTime = new Date(data.endTime);

      const conflict = await this.eventRepository.hasConflict(
        data.calendarId,
        startTime,
        endTime
      );

      if (conflict) {
        throw new Error('Conflito de horário detectado');
      }

      const event = {
        title: data.title.trim(),
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
        throw new Error('Evento não encontrado');
      }

      const updatedEvent = {
        title: data.title !== undefined ? data.title : existing.title,
        description:
          data.description !== undefined ? data.description : existing.description,
        startTime: data.startTime !== undefined ? data.startTime : existing.startTime,
        endTime: data.endTime !== undefined ? data.endTime : existing.endTime,
        calendarId:
          data.calendarId !== undefined ? data.calendarId : existing.calendarId
      };

      this.validate(updatedEvent);

      const startTime = new Date(updatedEvent.startTime);
      const endTime = new Date(updatedEvent.endTime);
      const calendarId = updatedEvent.calendarId.toString();

      const conflict = await this.eventRepository.hasConflict(
        calendarId,
        startTime,
        endTime,
        id
      );

      if (conflict) {
        throw new Error('Conflito de horário detectado');
      }

      const updateData = {
        title: updatedEvent.title.trim(),
        description: updatedEvent.description || null,
        startTime,
        endTime
      };

      if (data.calendarId !== undefined) {
        if (!ObjectId.isValid(data.calendarId)) {
          throw new Error('Campo "calendarId" é inválido');
        }

        const calendar = await this.calendarRepository.findById(data.calendarId);

        if (!calendar) {
          throw new Error('Calendário não encontrado');
        }

        updateData.calendarId = new ObjectId(data.calendarId);
      }

      return await this.eventRepository.updateById(id, updateData);
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

  async getEventById(id) {
    try {
      return await this.eventRepository.findById(id);
    } catch (error) {
      logError(error, 'EventService.getEventById');
      throw error;
    }
  }

  async deleteEvent(id) {
    try {
      const current = await this.eventRepository.findById(id);

      if (!current) {
        throw new Error('Evento não encontrado');
      }

      return await this.eventRepository.deleteById(id);
    } catch (error) {
      logError(error, 'EventService.deleteEvent');
      throw error;
    }
  }
}

module.exports = EventService;
