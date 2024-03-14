import * as chai from 'chai';
import { expect } from 'chai';
import * as sinon from 'sinon';
import { Request } from 'express';
import usersService from '../services/user.service'
import Users from '../database/models/User.Model';

describe('Teste User Services', () => {
  afterEach(() => {
    sinon.restore();
  });

  it('testa se retorna badRequest quando falta email', async () => {
    const result = await usersService.login('', 'senhaValida');
    expect(result).to.deep.equal({ status: 'badRequest', data: { message: 'All fields must be filled' } });
  });
  it('testa se retorna badRequest quando falta senha', async () => {
    const result = await usersService.login('emailValido@example.com', '');
    expect(result).to.deep.equal({ status: 'badRequest', data: { message: 'All fields must be filled' } });
  });
  it('testa se retorna unauthorized quando o email é invalido', async () => {
    const result = await usersService.login('notAnEmail', 'senhaValida');
    expect(result).to.deep.equal({ status: 'unauthorized', data: { message: 'Invalid email or password' } });
  });
  it('testa se retorna unauthorized quando o user não é encontrado', async () => {
    sinon.stub(Users, 'findOne').resolves(null);
    const result = await usersService.login('email@notfound.com', 'senhaValida');
    expect(result).to.deep.equal({ status: 'unauthorized', data: { message: 'Invalid email or password' } });
  });
  it('testa se retorna unauthorized quando a senha é menor que 6 caracteres', async () => {
    const result = await usersService.login('email@valido.com', '123');
    expect(result).to.deep.equal({ status: 'unauthorized', data: { message: 'Invalid email or password' } });
  });
  // it('testa se retorna unauthorized quando a senha está errada', async () => {
  //   sinon.stub(Users, 'findOne').resolves({ email: 'email@found.com', password: bcrypt.hashSync('senhaCorreta', 10) });
  //   const result = await usersService.login('email@found.com', 'senhaErrada');
  //   expect(result).to.deep.equal({ status: 'unauthorized', data: { message: 'Invalid email or password' } });
  // });
  // it('testa se está tudo certo com dados ok', async () => {
  //   sinon.stub(Users, 'findOne').resolves({ email: 'email@valido.com', password: bcrypt.hashSync('senhaValida', 10) });
  //   sinon.stub(bcrypt, 'compare').resolves(true);
  //   sinon.stub(usersService, 'createToken').returns('token_valido');
  //   const result = await usersService.login('email@valido.com', 'senhaValida');
  //   expect(result).to.deep.equal({ status: 'successful', data: { token: 'token_valido' } });
  // });
})