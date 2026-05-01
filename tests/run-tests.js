const { connect, getDB, disconnect } = require('../database');
const { logError } = require('../utils/logger');
const fs = require('fs');
const path = require('path');
const runUserTest = require('./UserTest');
const runCalendarTest = require('./CalendarTest');
const runEventTest = require('./EventTest');

const logPath = path.join(__dirname, '../logs/error.log');

async function runTests() {
  console.log('INICIANDO TESTES...\n');
  await runUserTest();
  await runCalendarTest();
  await runEventTest();
  console.log('\nTESTES FINALIZADOS!');
}

module.exports = runTests;

if (require.main === module) {
  runFromTerminal();
}

async function runFromTerminal() {
  let db;

  try {
    fs.mkdirSync(path.dirname(logPath), { recursive: true });
    fs.writeFileSync(logPath, '', 'utf8');
    await connect();
    db = getDB();
    await clearDatabase(db);
    await runTests();
  } catch (error) {
    logError(error, 'tests.run-tests');
  } finally {
    try {
      await disconnect();
    } catch (error) {
      logError(error, 'tests.run-tests.disconnect');
    }
  }
}

async function clearDatabase(db) {
  await db.collection('users').deleteMany({});
  await db.collection('calendars').deleteMany({});
  await db.collection('events').deleteMany({});
  console.log('Banco limpo\n');
}
