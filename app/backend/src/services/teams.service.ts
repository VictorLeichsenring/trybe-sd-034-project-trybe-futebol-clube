import ITeams from '../Interfaces/ITeams';
import Teams from '../database/models/Team.Model';

async function getAll(): Promise<ITeams[]> {
  const teams = await Teams.findAll();
  return teams;
}

export default {
  getAll,
};
