const { connect, disconnect } = require('./database');
const { logError } = require('./utils/logger');

(async () => {
  try {
    await connect();
    console.log('Projeto inicializado!');
  } catch (error) {
    logError(error, 'index.main');
  } finally {
    try {
      await disconnect();
    } catch (error) {
      logError(error, 'index.disconnect');
    }
  }
})();
