import { expect } from 'chai';
import * as sinon from 'sinon';
import { Request, Response } from 'express';
import matchesController from '../controllers/matches.controller';
import { matchService } from '../services';

describe('Matches Controller', () => {

  afterEach(() => {
    sinon.restore(); // Restaura todos os stubs
  });

  describe('getAll', () => {
    it('Deve retornar todas as partidas com status 200', async () => {
      const res: Partial<Response> = {
        status: sinon.stub().returnsThis(), // Permitindo chaining
        json: sinon.stub().returnsThis() // Permitindo chaining
      };
      
      const req: Partial<Request> = {
        query: {} // Define um objeto query vazio para simular uma requisição sem o parâmetro inProgress
      };
      
      const mockMatches = [
        { id: 1, homeTeamId: 1, awayTeamId: 2, homeTeamGoals: 3, awayTeamGoals: 0, inProgress: true },
        // Adicione mais partidas conforme necessário
      ];
      sinon.stub(matchService, 'getAll').resolves({ status: 'successful', data: mockMatches });
  
      await matchesController.getAll(req as Request, res as Response);
  
      expect((res.status as sinon.SinonStub).calledWith(200)).to.be.true;
      expect((res.json as sinon.SinonStub).calledWith(mockMatches)).to.be.true;
    });
  });
  

  describe('finishMatch', () => {
    it('Deve finalizar uma partida e retornar com status 200', async () => {
      const req: Partial<Request> = { params: { id: '1' } };
      const res: Partial<Response> = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub().returnsThis()
      };
      
      sinon.stub(matchService, 'finishMatch').resolves({ status: 'successful', data: { message: 'Finished' } });

      await matchesController.finishMatch(req as Request, res as Response);

      expect((res.status as sinon.SinonStub).calledWith(200)).to.be.true;
      expect((res.json as sinon.SinonStub).calledWith({ message: 'Finished' })).to.be.true;
    });
  });

  describe('updateMatch', () => {
    it('Deve atualizar uma partida e retornar com status 200', async () => {
      const req: Partial<Request> = {
        params: { id: '1' },
        body: { homeTeamGoals: 2, awayTeamGoals: 1 }
      };
      const res: Partial<Response> = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub().returnsThis()
      };
      
      sinon.stub(matchService, 'updateMatch').resolves({ status: 'successful', data: { message: 'Match updated successfully' } });

      await matchesController.updateMatch(req as Request, res as Response);

      expect((res.status as sinon.SinonStub).calledWith(200)).to.be.true;
      expect((res.json as sinon.SinonStub).calledWith({ message: 'Match updated successfully' })).to.be.true;
    });
  });

  // Adicione mais testes conforme necessário para cobrir outros métodos do controlador
});
