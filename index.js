const { connect, disconnect } = require('./database');
const createApp = require('./app');
const UserRepository = require('./repositories/UserRepository');
const CalendarRepository = require('./repositories/CalendarRepository');
const EventRepository = require('./repositories/EventRepository');
const UserService = require('./services/UserService');
const CalendarService = require('./services/CalendarService');
const EventService = require('./services/EventService');
const { logError } = require('./utils/logger');

const PORT = process.env.PORT || 3000;

async function start() {
  try {
    await connect();

    const userRepository = new UserRepository();
    const calendarRepository = new CalendarRepository();
    const eventRepository = new EventRepository();

    const userService = new UserService(userRepository);
    const calendarService = new CalendarService(
      calendarRepository,
      userRepository
    );
    const eventService = new EventService(eventRepository, calendarRepository);

    const app = createApp({
      userService,
      calendarService,
      eventService
    });

    const server = app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });

    const shutdown = async () => {
      server.close(async () => {
        try {
          await disconnect();
        } catch (error) {
          logError(error, 'index.shutdown');
        }
        process.exit(0);
      });
    };

    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
  } catch (error) {
    logError(error, 'index.start');
    try {
      await disconnect();
    } catch (disconnectError) {
      logError(disconnectError, 'index.disconnectAfterStartError');
    }
    process.exitCode = 1;
  }
}

start();
