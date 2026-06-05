const { ObjectId } = require('mongodb');
const { logError } = require('../utils/logger');

class CalendarService {
  constructor(calendarRepository, userRepository) {
    this.calendarRepository = calendarRepository;
    this.userRepository = userRepository;
  }

  validate(data) {
    if (!data.name || data.name.trim() === '') {
      throw new Error('Campo "name" é obrigatório');
    }

    if (!data.userId) {
      throw new Error('Campo "userId" é obrigatório');
    }
  }

  async createCalendar(data) {
    try {
      this.validate(data);

      if (!ObjectId.isValid(data.userId)) {
        throw new Error('Campo "userId" é inválido');
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
        throw new Error('Campo "name" já cadastrado para este usuário');
      }

      const calendar = {
        name: data.name.trim(),
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
        throw new Error('Campo "name" é obrigatório');
      }

      const ownerId = data.userId ? data.userId.toString() : current.userId.toString();

      if (data.name !== undefined) {
        const exists = await this.calendarRepository.nameExists(
          data.name,
          ownerId,
          id
        );

        if (exists) {
          throw new Error('Campo "name" já cadastrado para este usuário');
        }
      }

      const updateData = {};

      if (data.name !== undefined) {
        updateData.name = data.name.trim();
      }

      if (data.userId !== undefined) {
        if (!ObjectId.isValid(data.userId)) {
          throw new Error('Campo "userId" é inválido');
        }

        const user = await this.userRepository.findById(data.userId);

        if (!user) {
          throw new Error('Usuário não encontrado');
        }

        updateData.userId = new ObjectId(data.userId);
      }

      return await this.calendarRepository.updateById(id, updateData);
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

  async getCalendarById(id) {
    try {
      return await this.calendarRepository.findById(id);
    } catch (error) {
      logError(error, 'CalendarService.getCalendarById');
      throw error;
    }
  }

  async deleteCalendar(id) {
    try {
      const current = await this.calendarRepository.findById(id);

      if (!current) {
        throw new Error('Calendário não encontrado');
      }

      return await this.calendarRepository.deleteById(id);
    } catch (error) {
      logError(error, 'CalendarService.deleteCalendar');
      throw error;
    }
  }
}

module.exports = CalendarService;
