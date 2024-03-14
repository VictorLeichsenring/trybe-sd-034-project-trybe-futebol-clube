import * as chai from 'chai';
import { expect } from 'chai';
import * as sinon from 'sinon';
import { Request } from 'express';
import teamsService from '../services/teams.service';
import Teams from '../database/models/Team.Model';
import allTeamsMock from './teamMock';

describe('Teste Team Services', () => {
  describe('Teste da Função GetAll',() => {
    it('Verifica se retorna uma lista com 2 times', async () => {
      const allTeams = sinon.stub(Teams, 'findAll').resolves(allTeamsMock as []);
      const result = await teamsService.getAll();
      expect(result).to.deep.equal({ status: 'successful', data: allTeamsMock });
      allTeams.restore();
    });
  })
  describe('teste da Função GetById', () => {
    let stubFindById: sinon.SinonStub;

  beforeEach(() => {
    stubFindById = sinon.stub(Teams, 'findByPk');
  });

  afterEach(() => {
    stubFindById.restore();
  });
  it('Verifica se retorna um time com sucesso quando o time é encontrado', async () => {
    const expectedTeam = allTeamsMock[0];
    stubFindById.withArgs(expectedTeam.id).resolves(expectedTeam);
    const result = await teamsService.getById(expectedTeam.id);
    expect(result).to.deep.equal({ status: 'successful', data: expectedTeam });
  });

  it('Verifica se retorna uma mensagem de não encontrado quando o time não existe', async () => {
    const nonexistentId = 999;
    stubFindById.withArgs(nonexistentId).resolves(null);
    const result = await teamsService.getById(nonexistentId);
    expect(result).to.deep.equal({ status: 'notFound', data: { message: 'Team not found' } });
  });
  })
})