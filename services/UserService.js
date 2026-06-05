const { logError } = require('../utils/logger');

class UserService {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  validate(user, options = {}) {
    const requirePassword = options.requirePassword !== false;

    if (!user.name || user.name.trim() === '') {
      throw new Error('Campo "name" é obrigatório');
    }

    if (!user.email || user.email.trim() === '') {
      throw new Error('Campo "email" é obrigatório');
    }

    if (!this.isValidEmail(user.email)) {
      throw new Error('Campo "email" é inválido');
    }

    if (requirePassword) {
      if (!user.password || user.password.trim() === '') {
        throw new Error('Campo "password" é obrigatório');
      }
    }
  }

  async createUser(data) {
    try {
      const userData = {
        ...data,
        name: data.name ? data.name.trim() : data.name,
        email: data.email ? data.email.trim() : data.email
      };

      this.validate(userData);

      const exists = await this.userRepository.emailExists(userData.email);
      if (exists) {
        throw new Error('Campo "email" já cadastrado');
      }

      const user = {
        name: userData.name,
        email: userData.email,
        password: data.password,
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
      const current = await this.userRepository.findById(id);

      if (!current) {
        throw new Error('Usuário não encontrado');
      }

      if (data.name !== undefined && data.name.trim() === '') {
        throw new Error('Campo "name" é obrigatório');
      }

      if (data.email !== undefined) {
        const email = data.email.trim();

        if (email === '') {
          throw new Error('Campo "email" é obrigatório');
        }

        if (!this.isValidEmail(email)) {
          throw new Error('Campo "email" é inválido');
        }

        const exists = await this.userRepository.emailExists(email, id);
        if (exists) {
          throw new Error('Campo "email" já cadastrado');
        }

        data.email = email;
      }

      if (data.password !== undefined && data.password.trim() === '') {
        throw new Error('Campo "password" é obrigatório');
      }

      const updateData = {};

      if (data.name !== undefined) {
        updateData.name = data.name.trim();
      }

      if (data.email !== undefined) {
        updateData.email = data.email.trim();
      }

      if (data.password !== undefined) {
        updateData.password = data.password;
      }

      return await this.userRepository.updateById(id, updateData);
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

  async getUserById(id) {
    try {
      return await this.userRepository.findById(id);
    } catch (error) {
      logError(error, 'UserService.getUserById');
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
      const current = await this.userRepository.findById(id);

      if (!current) {
        throw new Error('Usuário não encontrado');
      }

      return await this.userRepository.deleteById(id);
    } catch (error) {
      logError(error, 'UserService.deleteUserById');
      throw error;
    }
  }

  async authenticate(email, password) {
    try {
      const user = await this.userRepository.findByEmail(email.trim());

      if (!user || user.password !== password) {
        return null;
      }

      return user;
    } catch (error) {
      logError(error, 'UserService.authenticate');
      throw error;
    }
  }
}

module.exports = UserService;
