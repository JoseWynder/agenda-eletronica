const UserRepository = require('../repositories/UserRepository');
const UserService = require('../services/UserService');
const CalendarRepository = require('../repositories/CalendarRepository');
const CalendarService = require('../services/CalendarService');
const EventRepository = require('../repositories/EventRepository');
const EventService = require('../services/EventService');

module.exports = async function runEventTest() {
  const userService = new UserService(new UserRepository());
  const calendarService = new CalendarService(new CalendarRepository());
  const eventService = new EventService(new EventRepository());

  console.log('\nEVENT TEST');

  const createdUser = await userService.createUser({
    name: 'Carlos',
    email: 'carlos@email.com'
  });

  const createdCalendar = await calendarService.createCalendar({
    name: 'Trabalho',
    userId: createdUser.insertedId
  });

  const firstEvent = await eventService.createEvent({
    title: 'Reuniao',
    startTime: '2026-05-01T10:00:00',
    endTime: '2026-05-01T11:00:00',
    calendarId: createdCalendar.insertedId
  });
  console.log('Evento criado:', firstEvent.insertedId.toString());

  const secondEvent = await eventService.createEvent({
    title: 'Almoco',
    description: 'Almoco com equipe',
    startTime: '2026-05-01T12:00:00',
    endTime: '2026-05-01T13:00:00',
    calendarId: createdCalendar.insertedId
  });
  console.log('Segundo evento criado:', secondEvent.insertedId.toString());

  const events = await eventService.getEventsByCalendar(createdCalendar.insertedId);
  console.log('Quantidade de eventos:', events.length);

  await eventService.updateEvent(firstEvent.insertedId, {
    title: 'Reuniao Atualizada',
    startTime: '2026-05-01T08:00:00',
    endTime: '2026-05-01T09:00:00'
  });
  console.log('Evento atualizado com sucesso');

  await expectError(
    () => eventService.createEvent({
      startTime: '2026-05-01T14:00:00',
      endTime: '2026-05-01T15:00:00',
      calendarId: createdCalendar.insertedId
    }),
    'Titulo obrigatorio'
  );

  await expectError(
    () => eventService.createEvent({
      title: 'Sem datas',
      calendarId: createdCalendar.insertedId
    }),
    'Datas obrigatorias'
  );

  await expectError(
    () => eventService.createEvent({
      title: 'Data invalida',
      startTime: 'data-invalida',
      endTime: '2026-05-01T15:00:00',
      calendarId: createdCalendar.insertedId
    }),
    'Data invalida'
  );

  await expectError(
    () => eventService.createEvent({
      title: 'Data invertida',
      startTime: '2026-05-01T16:00:00',
      endTime: '2026-05-01T15:00:00',
      calendarId: createdCalendar.insertedId
    }),
    'Ordem de datas'
  );

  await expectError(
    () => eventService.createEvent({
      title: 'Descricao vazia',
      description: '',
      startTime: '2026-05-01T14:00:00',
      endTime: '2026-05-01T15:00:00',
      calendarId: createdCalendar.insertedId
    }),
    'Descricao vazia'
  );

  await expectError(
    () => eventService.createEvent({
      title: 'Conflito',
      startTime: '2026-05-01T12:30:00',
      endTime: '2026-05-01T13:30:00',
      calendarId: createdCalendar.insertedId
    }),
    'Conflito de horario'
  );

  await expectError(
    () => eventService.updateEvent(secondEvent.insertedId, {
      startTime: '2026-05-01T08:30:00',
      endTime: '2026-05-01T09:30:00'
    }),
    'Conflito no update'
  );

  await expectError(
    () => eventService.updateEvent('507f1f77bcf86cd799439012', {
      title: 'Inexistente',
      startTime: '2026-05-01T18:00:00',
      endTime: '2026-05-01T19:00:00'
    }),
    'Evento inexistente'
  );
};

async function expectError(action, label) {
  try {
    await action();
    console.log('ERRO: teste deveria falhar -', label);
  } catch (error) {
    console.log('OK:', label, '-', error.message);
  }
}
