import { expect } from 'chai';
import * as sinon from 'sinon';
import { Request, Response } from 'express';
import userController from '../controllers/user.controller'; // Ajuste para o caminho correto
import { userService } from '../services'; // Ajuste para o caminho correto

describe('Login Controller', () => {
  let res: Partial<Response>;
  
  beforeEach(() => {
    res = {
      status: sinon.stub().returnsThis(), // Permitindo chaining
      json: sinon.stub().returnsThis() // Permitindo chaining
    };
  });

  afterEach(() => {
    sinon.restore(); // Restaura todos os mocks/stubs/spies
  });

  it('Deve retornar 400 se email ou senha não forem fornecidos', async () => {
    const req = { body: { email: '', password: '' } } as Partial<Request>;
    
    await userController.login(req as Request, res as Response);

    expect((res.status as sinon.SinonStub).calledWith(400)).to.be.true;
    expect((res.json as sinon.SinonStub).calledWithMatch({ message: "All fields must be filled" })).to.be.true;
  });

  it('Deve retornar 401 para credenciais inválidas', async () => {
    const req = { body: { email: 'user@example.com', password: 'wrongPassword' } } as Partial<Request>;
    sinon.stub(userService, 'login').resolves({ status: 'unauthorized', data: { message: 'Invalid email or password' } });
    
    await userController.login(req as Request, res as Response);

    expect((res.status as sinon.SinonStub).calledWith(401)).to.be.true;
    expect((res.json as sinon.SinonStub).calledWith({ message: 'Invalid email or password' })).to.be.true;
  });

  it('Deve retornar 200 e um token para credenciais válidas', async () => {
    const req = { body: { email: 'user@valid.com', password: 'correctPassword' } } as Partial<Request>;
    sinon.stub(userService, 'login').resolves({ status: 'successful', data: { token: 'valid_token' } });
    
    await userController.login(req as Request, res as Response);

    expect((res.status as sinon.SinonStub).calledWith(200)).to.be.true;
    expect((res.json as sinon.SinonStub).calledWith({ token: 'valid_token' })).to.be.true;
  });

  // Adicione mais testes conforme necessário para cobrir outros cenários
});
