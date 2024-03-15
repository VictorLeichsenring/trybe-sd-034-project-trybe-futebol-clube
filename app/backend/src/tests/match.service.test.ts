import * as chai from 'chai';
import { expect } from 'chai';
import * as sinon from 'sinon';
import { Request } from 'express';
import matchService from '../services/match.service'
import Matches from '../database/models/Match.Model';
import Teams from '../database/models/Team.Model';

describe('Teste Match Services', () => {
  afterEach(() => {
    sinon.restore();
  });

  it('testa se getAll retorna todas as partidas', async () => {
    const matchesMock = [
      { 
        id: 1, 
        homeTeamId: 1, 
        awayTeamId: 2, 
        homeTeamGoals: 3, 
        awayTeamGoals: 0, 
        inProgress: false,
        homeTeam: { teamName: "Avaí/Kindermann" }, // Ajuste conforme os nomes reais esperados
        awayTeam: { teamName: "Bahia" }
      },
      // Adicione mais objetos de partida conforme necessário
    ];
    sinon.stub(Matches, 'findAll').resolves(matchesMock as any); // Use 'as any' para contornar problemas de tipagem no stub
    const result = await matchService.getAll();
    expect(result.data).to.deep.equal(matchesMock); // Certifique-se de que a estrutura esperada corresponda exatamente
    expect(result.status).to.equal('successful');
  });
  

  it('testa se finishMatch finaliza uma partida em progresso', async () => {
    const matchInProgressMock = { id: 1, inProgress: true, update: sinon.spy() };
    sinon.stub(Matches, 'findByPk').resolves(matchInProgressMock as any);
    const result = await matchService.finishMatch(1);
    expect(result).to.deep.equal({ status: 'successful', data: { message: 'Finished' } });
    expect(matchInProgressMock.update.calledWith({ inProgress: false })).to.be.true;
  });

  it('testa se updateMatch atualiza os gols de uma partida', async () => {
    const matchInProgressMock = { id: 1, inProgress: true, update: sinon.spy() };
    sinon.stub(Matches, 'findByPk').resolves(matchInProgressMock as any);
    const result = await matchService.updateMatch(1, 3, 1);
    expect(result).to.deep.equal({ status: 'successful', data: { message: 'Match updated successfully' } });
    expect(matchInProgressMock.update.calledWith({ homeTeamGoals: 3, awayTeamGoals: 1 })).to.be.true;
  });

  it('testa se createMatch rejeita criar uma partida com times iguais', async () => {
    const result = await matchService.createMatch({ homeTeamId: 1, awayTeamId: 1, homeTeamGoals: 0, awayTeamGoals: 0 });
    expect(result).to.deep.equal({ status: 'invalidValue', data: { message: 'It is not possible to create a match with two equal teams' } });
  });

  // Adicione mais casos de teste conforme necessário
});