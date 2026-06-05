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
    email: 'maria@email.com',
    password: '123456'
  });

  const createdCalendar = await calendarService.createCalendar({
    name: 'Pessoal',
    userId: createdUser.insertedId
  });
  console.log('Calendário criado:', createdCalendar.insertedId.toString());

  const calendars = await calendarService.getCalendarsByUser(createdUser.insertedId);
  console.log('Quantidade de calendários do usuário:', calendars.length);

  await calendarService.updateCalendar(createdCalendar.insertedId, {
    name: 'Pessoal Atualizado'
  });
  console.log('Calendário atualizado com sucesso');

  await expectError(
    () => calendarService.createCalendar({ name: '', userId: createdUser.insertedId }),
    'Campo "name" obrigatório'
  );

  await expectError(
    () => calendarService.createCalendar({ name: 'Sem usuario' }),
    'Campo "userId" obrigatório'
  );

  await expectError(
    () => calendarService.createCalendar({
      name: 'Pessoal Atualizado',
      userId: createdUser.insertedId
    }),
    'Campo "name" duplicado para o mesmo usuário'
  );

  await expectError(
    () => calendarService.createCalendar({
      name: 'Usuario inexistente',
      userId: '507f1f77bcf86cd799439011'
    }),
    'Campo "userId" inexistente'
  );

  await expectError(
    () => calendarService.updateCalendar('507f1f77bcf86cd799439011', { name: 'Inexistente' }),
    'Calendário inexistente'
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
