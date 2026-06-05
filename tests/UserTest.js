const UserRepository = require('../repositories/UserRepository');
const UserService = require('../services/UserService');

module.exports = async function runUserTest() {
  const userService = new UserService(new UserRepository());

  console.log('USER TEST');

  const createdUser = await userService.createUser({
    name: 'Jose',
    email: 'jose@email.com',
    password: '123456'
  });
  console.log('Usuário criado:', createdUser.insertedId.toString());

  const user = await userService.getUserByEmail('jose@email.com');
  console.log('Usuário encontrado:', user.email);

  await userService.updateUser(createdUser.insertedId, {
    name: 'Jose Atualizado'
  });
  console.log('Usuário atualizado com sucesso');

  await expectError(
    () => userService.createUser({ name: '', email: 'vazio@email.com', password: '123456' }),
    'Campo "name" obrigatório'
  );

  await expectError(
    () => userService.createUser({ name: 'Sem email', email: '', password: '123456' }),
    'Campo "email" obrigatório'
  );

  await expectError(
    () => userService.createUser({ name: 'Email invalido', email: 'email-invalido', password: '123456' }),
    'Campo "email" inválido'
  );

  await expectError(
    () => userService.createUser({ name: 'Duplicado', email: 'jose@email.com', password: '123456' }),
    'Campo "email" duplicado'
  );

  const authUser = await userService.authenticate('jose@email.com', '123456');
  console.log('Autenticação ok:', authUser.email);
};

async function expectError(action, label) {
  try {
    await action();
    console.log('ERRO: teste deveria falhar -', label);
  } catch (error) {
    console.log('OK:', label, '-', error.message);
  }
}
