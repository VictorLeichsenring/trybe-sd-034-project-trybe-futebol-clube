import { expect } from 'chai';
import * as sinon from 'sinon';
import { Request, Response } from 'express';
import teamsController from '../controllers/teams.controller';
import { teamService } from '../services';

describe('Teams Controller', () => {
  // Encapsula ambos os conjuntos de testes para getAll e getById

  describe('getAll', () => {
    it('Deve retornar todos os times com status 200', async () => {
      // Cria um objeto fake para Response
      const res: Partial<Response> = {};
      res.status = sinon.stub().returns(res); // Chainable
      res.json = sinon.stub().returns(res); // Chainable
      
      // Outras configurações permanecem iguais
      const mockTeams = [{ id: 1, teamName: 'time 1' }, { id: 2, teamName: 'time 2' }];
      sinon.stub(teamService, 'getAll').resolves({ status: 'successful', data: mockTeams });

      await teamsController.getAll({} as Request, res as Response);

      expect((res.status as sinon.SinonStub).calledWith(200)).to.be.true;
      expect((res.json as sinon.SinonStub).calledWith(mockTeams)).to.be.true;

      sinon.restore(); // Restaura todos os stubs
    });
  });

  describe('getById', () => {
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
  
    it('Deve retornar um time pelo ID com status 200', async () => {
      const req = { params: { id: '1' } } as Partial<Request>;
      const mockTeam = { id: 1, teamName: 'time 1' };
  
      sinon.stub(teamService, 'getById').resolves({ status: 'successful', data: mockTeam });
  
      await teamsController.getById(req as Request, res as Response);
  
      expect((res.status as sinon.SinonStub).calledWith(200)).to.be.true;
      expect((res.json as sinon.SinonStub).calledWith(mockTeam)).to.be.true;
    });
  
    it('Deve retornar 404 se o time não for encontrado', async () => {
      const req = { params: { id: '999' } } as Partial<Request>;
  
      sinon.stub(teamService, 'getById').resolves({ status: 'notFound', data: { message: 'Team not found' } });
  
      await teamsController.getById(req as Request, res as Response);
  
      expect((res.status as sinon.SinonStub).calledWith(404)).to.be.true;
      expect((res.json as sinon.SinonStub).calledWith({ message: 'Team not found' })).to.be.true;
    });
  });
});
