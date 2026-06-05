const { formatUser } = require('../utils/formatters');

function createUserController({ userService }) {
  return {
    list: async (req, res) => {
      try {
        const users = await userService.getAllUsers();

        return res.json({
          users: users.map(formatUser)
        });
      } catch (error) {
        return res.status(500).json({ error: error.message });
      }
    },

    getById: async (req, res) => {
      try {
        const user = await userService.getUserById(req.params.id);

        if (!user) {
          return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        return res.json({
          user: formatUser(user)
        });
      } catch (error) {
        return res.status(500).json({ error: error.message });
      }
    },

    create: async (req, res) => {
      try {
        await userService.createUser(req.body || {});
        const email = req.body.email ? req.body.email.trim() : req.body.email;
        const user = await userService.getUserByEmail(email);

        return res.status(201).json({
          message: 'Usuário criado com sucesso',
          user: formatUser(user)
        });
      } catch (error) {
        return res.status(400).json({ error: error.message });
      }
    },

    update: async (req, res) => {
      try {
        const result = await userService.updateUser(req.params.id, req.body || {});

        if (!result.matchedCount) {
          return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        const user = await userService.getUserById(req.params.id);

        return res.json({
          message: 'Usuário atualizado com sucesso',
          user: formatUser(user)
        });
      } catch (error) {
        return res.status(400).json({ error: error.message });
      }
    },

    remove: async (req, res) => {
      try {
        const result = await userService.deleteUserById(req.params.id);

        if (!result.deletedCount) {
          return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        return res.json({
          message: 'Usuário removido com sucesso'
        });
      } catch (error) {
        return res.status(400).json({ error: error.message });
      }
    }
  };
}

module.exports = createUserController;
