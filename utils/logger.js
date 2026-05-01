const fs = require('fs');
const path = require('path');

const logDir = path.join(__dirname, '../logs');
const logPath = path.join(logDir, 'error.log');

function ensureLogDir() {
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
  }
}

function logError(error, context = '', extra = null) {
  try {
    ensureLogDir();

    const log = [
      `[${new Date().toISOString()}]`,
      `Context: ${context}`,
      `Message: ${error.message}`,
      `Stack: ${error.stack}`,
      extra ? `Extra: ${JSON.stringify(extra)}` : null,
      '-----------------------------------\n'
    ]
      .filter(Boolean)
      .join('\n');

    fs.appendFileSync(logPath, log, 'utf8');

  } catch (err) {
    console.error('Erro ao escrever log:', err.message);
  }
}

module.exports = { logError };
