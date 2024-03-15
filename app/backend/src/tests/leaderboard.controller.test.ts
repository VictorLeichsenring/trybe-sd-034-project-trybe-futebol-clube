import { expect } from 'chai';
import * as sinon from 'sinon';
import { Request, Response } from 'express';
import leaderboardController from '../controllers/leaderboard.controller';
import { leaderboardService } from '../services';

interface ILeaderboardItem {
  name: string;
  totalPoints: number;
  totalGames: number;
  totalVictories: number;
  totalDraws: number;
  totalLosses: number;
  goalsFavor: number;
  goalsOwn: number;
  goalsBalance: number;
  efficiency: string;
}


describe('Leaderboard Controller', () => {

  afterEach(() => {
    sinon.restore(); // Restaura todos os stubs
  });

  describe('getHomeLeaderboard', () => {
    it('Deve retornar o leaderboard em casa com status 200', async () => {
      const res: Partial<Response> = {
        status: sinon.stub().returnsThis(), // Permitindo chaining
        json: sinon.stub().returnsThis() // Permitindo chaining
      };

      // Exemplo de como ajustar os mocks com tipagem explícita
      const homeLeaderboardMock: ILeaderboardItem[] = [
        {
          name: 'Avaí/Kindermann',
          totalPoints: 6,
          totalGames: 2,
          totalVictories: 2,
          totalDraws: 0,
          totalLosses: 0,
          goalsFavor: 6,
          goalsOwn: 0,
          goalsBalance: 6,
          efficiency: '100.00'
        },
        // Adicione mais itens conforme necessário
      ];

      // Faça ajustes similares para awayLeaderboardMock e generalLeaderboardMock

      sinon.stub(leaderboardService, 'getHomeLeaderboard').resolves(homeLeaderboardMock);

      await leaderboardController.getHomeLeaderboard({} as Request, res as Response);

      expect((res.status as sinon.SinonStub).calledWith(200)).to.be.true;
      expect((res.json as sinon.SinonStub).calledWith(homeLeaderboardMock)).to.be.true;
    });
  });

  // describe('getAwayLeaderboard', () => {
  //   it('Deve retornar o leaderboard fora de casa com status 200', async () => {
  //     const res: Partial<Response> = {
  //       status: sinon.stub().returnsThis(),
  //       json: sinon.stub().returnsThis()
  //     };

  //     const awayLeaderboardMock = [
  //       // Mock dos dados do leaderboard fora de casa
  //     ];
  //     sinon.stub(leaderboardService, 'getAwayLeaderboard').resolves(awayLeaderboardMock);

  //     await leaderboardController.getAwayLeaderboard({} as Request, res as Response);

  //     expect((res.status as sinon.SinonStub).calledWith(200)).to.be.true;
  //     expect((res.json as sinon.SinonStub).calledWith(awayLeaderboardMock)).to.be.true;
  //   });
  // });

  // describe('generalLeaderboard', () => {
  //   it('Deve retornar o leaderboard geral com status 200', async () => {
  //     const res: Partial<Response> = {
  //       status: sinon.stub().returnsThis(),
  //       json: sinon.stub().returnsThis()
  //     };

  //     const generalLeaderboardMock = [
  //       // Mock dos dados do leaderboard geral
  //     ];
  //     sinon.stub(leaderboardService, 'getGeneralLeaderboard').resolves(generalLeaderboardMock);

  //     await leaderboardController.generalLeaderboard({} as Request, res as Response);

  //     expect((res.status as sinon.SinonStub).calledWith(200)).to.be.true;
  //     expect((res.json as sinon.SinonStub).calledWith(generalLeaderboardMock)).to.be.true;
  //   });
  // });

  // Aqui, você pode adicionar mais casos de teste conforme necessário para cobrir outros cenários
});
