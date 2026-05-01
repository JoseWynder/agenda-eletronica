const { MongoClient } = require('mongodb');
const { logError } = require('./utils/logger');

const uri = 'mongodb://localhost:27017/mongo-test';

let client;
let db;

async function connect() {
  try {
    if (db) return db;

    client = new MongoClient(uri);
    await client.connect();

    db = client.db();

    console.log('Conectado ao MongoDB');
    return db;

  } catch (error) {
    logError(error, 'database.connect');
    throw error;
  }
}

function getDB() {
  if (!db) {
    throw new Error('Banco não conectado');
  }
  return db;
}

async function disconnect() {
  try {
    if (client) {
      await client.close();
      db = null;
      console.log('Desconectado do MongoDB');
    }
  } catch (error) {
    logError(error, 'database.disconnect');
    throw error;
  }
}

module.exports = {
  connect,
  getDB,
  disconnect
};
