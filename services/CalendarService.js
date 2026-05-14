const { ObjectId } = require('mongodb');
const { logError } = require('../utils/logger');

class CalendarService {
  constructor(calendarRepository, userRepository) {
    this.calendarRepository = calendarRepository;
    this.userRepository = userRepository;
  }

  validate(data) {
    if (!data.name || data.name.trim() === '') {
      throw new Error('Nome do calendário é obrigatório');
    }

    if (!data.userId) {
      throw new Error('userId é obrigatório');
    }
  }

  async createCalendar(data) {
    try {
      this.validate(data);

      if (!ObjectId.isValid(data.userId)) {
        throw new Error('userId inválido');
      }

      const user = await this.userRepository.findById(data.userId);

      if (!user) {
        throw new Error('Usuário não encontrado');
      }

      const exists = await this.calendarRepository.nameExists(
        data.name,
        data.userId
      );

      if (exists) {
        throw new Error('Já existe um calendário com esse nome para esse usuário');
      }

      const calendar = {
        name: data.name,
        userId: new ObjectId(data.userId),
        createdAt: new Date()
      };

      return await this.calendarRepository.create(calendar);
    } catch (error) {
      logError(error, 'CalendarService.createCalendar');
      throw error;
    }
  }

  async updateCalendar(id, data) {
    try {
      const current = await this.calendarRepository.findById(id);

      if (!current) {
        throw new Error('Calendário não encontrado');
      }

      if (data.name !== undefined && data.name.trim() === '') {
        throw new Error('Nome do calendário é obrigatório');
      }

      const userId = data.userId || current.userId;

      if (data.name) {
        const exists = await this.calendarRepository.nameExists(
          data.name,
          userId,
          id
        );

        if (exists) {
          throw new Error('Já existe um calendário com esse nome para esse usuário');
        }
      }

      if (data.userId) {
        data.userId = new ObjectId(data.userId);
      }

      return await this.calendarRepository.updateById(id, data);
    } catch (error) {
      logError(error, 'CalendarService.updateCalendar');
      throw error;
    }
  }

  async getCalendarsByUser(userId) {
    try {
      return await this.calendarRepository.findByUserId(userId);
    } catch (error) {
      logError(error, 'CalendarService.getCalendarsByUser');
      throw error;
    }
  }

  async deleteCalendar(id) {
    try {
      return await this.calendarRepository.deleteById(id);
    } catch (error) {
      logError(error, 'CalendarService.deleteCalendar');
      throw error;
    }
  }
}

module.exports = CalendarService;
