const { logError } = require('../utils/logger');

class UserService {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  validate(user) {
    if (!user.name || user.name.trim() === '') {
      throw new Error('Nome é obrigatório');
    }

    if (!user.email || user.email.trim() === '') {
      throw new Error('Email é obrigatório');
    }

    if (!this.isValidEmail(user.email)) {
      throw new Error('Email inválido');
    }
  }

  async createUser(data) {
    try {
      this.validate(data);

      const exists = await this.userRepository.emailExists(data.email);
      if (exists) {
        throw new Error('Email já cadastrado');
      }

      const user = {
        ...data,
        createdAt: new Date()
      };

      return await this.userRepository.create(user);

    } catch (error) {
      logError(error, 'UserService.createUser');
      throw error;
    }
  }

  async updateUser(id, data) {
    try {
      if (data.name !== undefined && data.name.trim() === '') {
        throw new Error('Nome é obrigatório');
      }

      if (data.email !== undefined) {
        if (data.email.trim() === '') {
          throw new Error('Email é obrigatório');
        }

        if (!this.isValidEmail(data.email)) {
          throw new Error('Email inválido');
        }

        const exists = await this.userRepository.emailExists(data.email, id);
        if (exists) {
          throw new Error('Email já cadastrado');
        }
      }

      return await this.userRepository.updateById(id, data);

    } catch (error) {
      logError(error, 'UserService.updateUser');
      throw error;
    }
  }

  async getAllUsers() {
    try {
      return await this.userRepository.findAll();
    } catch (error) {
      logError(error, 'UserService.getAllUsers');
      throw error;
    }
  }

  async getUserByEmail(email) {
    try {
      return await this.userRepository.findByEmail(email);
    } catch (error) {
      logError(error, 'UserService.getUserByEmail');
      throw error;
    }
  }

  async deleteUserByEmail(email) {
    try {
      return await this.userRepository.deleteByEmail(email);
    } catch (error) {
      logError(error, 'UserService.deleteUserByEmail');
      throw error;
    }
  }

  async deleteUserById(id) {
    try {
      return await this.userRepository.deleteById(id);
    } catch (error) {
      logError(error, 'UserService.deleteUserById');
      throw error;
    }
  }
}

module.exports = UserService;
