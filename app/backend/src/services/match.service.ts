import { RespType } from '../types/RespService';
import Matches from '../database/models/Match.Model';
import Teams from '../database/models/Team.Model';

const getAll = async (): Promise<RespType> => {
  const matches = await Matches.findAll();
  const teams = await Teams.findAll();

  // Combina os dados de matches e teams
  const matchesData = matches.map((match) => {
    const homeTeam = teams.find((team) => team.id === match.homeTeamId);
    const awayTeam = teams.find((team) => team.id === match.awayTeamId);
    return {
      id: match.id,
      homeTeamId: match.homeTeamId,
      homeTeamGoals: match.homeTeamGoals,
      awayTeamId: match.awayTeamId,
      awayTeamGoals: match.awayTeamGoals,
      inProgress: match.inProgress,
      homeTeam: { teamName: homeTeam?.teamName },
      awayTeam: { teamName: awayTeam?.teamName },
    };
  });

  return { status: 'successful', data: matchesData };
};

export default {
  getAll,
};
