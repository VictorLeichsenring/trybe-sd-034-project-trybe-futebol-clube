import * as chai from 'chai';
import { expect } from 'chai';
import * as sinon from 'sinon';
import leaderboardService from '../services/leaderboard.service';
import Matches from '../database/models/Match.Model';
import Teams from '../database/models/Team.Model';

describe('Leaderboard Service', () => {
  afterEach(() => {
    sinon.restore();
  });

  it('testa se getGeneralLeaderboard retorna a classificação geral corretamente', async () => {
    const teamsMock = [
      { id: 1, teamName: "Avaí/Kindermann" },
      { id: 2, teamName: "Bahia" },
      // Inclua outros times conforme necessário
    ];
    sinon.stub(Teams, 'findAll').resolves(teamsMock as any);

    const matchesMock = [
      { id: 1, homeTeamId: 1, awayTeamId: 2, homeTeamGoals: 3, awayTeamGoals: 0, inProgress: false },
      // Garantindo que "Bahia" apareça nos resultados, mesmo perdendo
      { id: 2, homeTeamId: 2, awayTeamId: 1, homeTeamGoals: 0, awayTeamGoals: 3, inProgress: false },
    ];
    sinon.stub(Matches, 'findAll').resolves(matchesMock as any);

    const result = await leaderboardService.getGeneralLeaderboard();

    const expectedLeaderboard = [
      {
        name: "Avaí/Kindermann",
        totalPoints: 6, // Ajuste os valores conforme a lógica do seu leaderboard
        totalGames: 2,
        totalVictories: 2,
        totalDraws: 0,
        totalLosses: 0,
        goalsFavor: 6,
        goalsOwn: 0,
        goalsBalance: 6,
        efficiency: "100.00" // Ajuste conforme necessário
      },
      {
        name: "Bahia",
        totalPoints: 0, // Ajuste os valores conforme a lógica do seu leaderboard
        totalGames: 2,
        totalVictories: 0,
        totalDraws: 0,
        totalLosses: 2,
        goalsFavor: 0,
        goalsOwn: 6,
        goalsBalance: -6,
        efficiency: "0.00" // Ajuste conforme necessário
      },
      // Adicione outros times conforme necessário
    ];

    expect(result).to.deep.equal(expectedLeaderboard);
  });

  // Adicione mais casos de teste conforme necessário
});
