const UserRepository = require('../repositories/UserRepository');
const UserService = require('../services/UserService');
const CalendarRepository = require('../repositories/CalendarRepository');
const CalendarService = require('../services/CalendarService');

module.exports = async function runCalendarTest() {
  const userRepository = new UserRepository();
  const calendarRepository = new CalendarRepository();
  const userService = new UserService(userRepository);
  const calendarService = new CalendarService(
    calendarRepository,
    userRepository
  );

  console.log('\nCALENDAR TEST');

  const createdUser = await userService.createUser({
    name: 'Maria',
    email: 'maria@email.com'
  });

  const createdCalendar = await calendarService.createCalendar({
    name: 'Pessoal',
    userId: createdUser.insertedId
  });
  console.log('Calendario criado:', createdCalendar.insertedId.toString());

  const calendars = await calendarService.getCalendarsByUser(createdUser.insertedId);
  console.log('Quantidade de calendarios do usuario:', calendars.length);

  await calendarService.updateCalendar(createdCalendar.insertedId, {
    name: 'Pessoal Atualizado'
  });
  console.log('Calendario atualizado com sucesso');

  await expectError(
    () => calendarService.createCalendar({ name: '', userId: createdUser.insertedId }),
    'Nome obrigatorio'
  );

  await expectError(
    () => calendarService.createCalendar({ name: 'Sem usuario' }),
    'UserId obrigatorio'
  );

  await expectError(
    () => calendarService.createCalendar({
      name: 'Pessoal Atualizado',
      userId: createdUser.insertedId
    }),
    'Nome duplicado para o mesmo usuario'
  );

  await expectError(
    () => calendarService.createCalendar({
      name: 'Usuario inexistente',
      userId: '507f1f77bcf86cd799439011'
    }),
    'UserId inexistente'
  );

  await expectError(
    () => calendarService.updateCalendar('507f1f77bcf86cd799439011', { name: 'Inexistente' }),
    'Calendario inexistente'
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
