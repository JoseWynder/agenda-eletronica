const { formatUser } = require('../utils/formatters');

function createAuthController({ userService }) {
  return {
    login: async (req, res) => {
      try {
        const { email, password } = req.body || {};

        if (!email || email.trim() === '') {
          return res.status(400).json({ error: 'Campo "email" é obrigatório' });
        }

        if (!password || password.trim() === '') {
          return res.status(400).json({ error: 'Campo "password" é obrigatório' });
        }

        const user = await userService.authenticate(email, password);

        if (!user) {
          return res.status(401).json({ error: 'Credenciais inválidas' });
        }

        req.session.user = {
          id: user._id.toString(),
          name: user.name,
          email: user.email
        };

        return res.json({
          message: 'Login realizado com sucesso',
          user: formatUser(user)
        });
      } catch (error) {
        return res.status(500).json({ error: error.message });
      }
    },

    logout: (req, res) => {
      if (!req.session) {
        return res.json({ message: 'Logout realizado com sucesso' });
      }

      req.session.destroy((error) => {
        if (error) {
          return res.status(500).json({ error: 'Erro ao encerrar sessão' });
        }

        return res.json({ message: 'Logout realizado com sucesso' });
      });
    },

    session: (req, res) => {
      if (!req.session || !req.session.user) {
        return res.status(401).json({ error: 'Autenticação necessária' });
      }

      return res.json({
        authenticated: true,
        user: req.session.user
      });
    }
  };
}

module.exports = createAuthController;
