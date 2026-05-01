const UserRepository = require('../repositories/UserRepository');
const UserService = require('../services/UserService');

module.exports = async function runUserTest() {
  const userService = new UserService(new UserRepository());

  console.log('USER TEST');

  const createdUser = await userService.createUser({
    name: 'Jose',
    email: 'jose@email.com'
  });
  console.log('Usuario criado:', createdUser.insertedId.toString());

  const user = await userService.getUserByEmail('jose@email.com');
  console.log('Usuario encontrado:', user.email);

  await userService.updateUser(createdUser.insertedId, {
    name: 'Jose Atualizado'
  });
  console.log('Usuario atualizado com sucesso');

  await expectError(
    () => userService.createUser({ name: '', email: 'vazio@email.com' }),
    'Nome obrigatorio'
  );

  await expectError(
    () => userService.createUser({ name: 'Sem email', email: '' }),
    'Email obrigatorio'
  );

  await expectError(
    () => userService.createUser({ name: 'Email invalido', email: 'email-invalido' }),
    'Email invalido'
  );

  await expectError(
    () => userService.createUser({ name: 'Duplicado', email: 'jose@email.com' }),
    'Email duplicado'
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
