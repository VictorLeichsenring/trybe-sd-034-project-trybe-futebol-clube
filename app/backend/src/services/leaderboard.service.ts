import Matches from '../database/models/Match.Model';
import Teams from '../database/models/Team.Model';

interface ITeamStats {
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
interface IMatch {
  homeTeamId: number;
  awayTeamId: number;
  homeTeamGoals: number;
  awayTeamGoals: number;
  inProgress: boolean;
}

interface ITeam {
  id: number;
  teamName: string;
}
async function getTeams() {
  const teams = await Teams.findAll();
  return teams;
}

async function getMatches() {
  const matches = await Matches.findAll();
  return matches;
}

function initializeTeamStats(): ITeamStats {
  return {
    name: '',
    totalPoints: 0,
    totalGames: 0,
    totalVictories: 0,
    totalDraws: 0,
    totalLosses: 0,
    goalsFavor: 0,
    goalsOwn: 0,
    goalsBalance: 0,
    efficiency: '0.00',
  };
}

function updateTeamStatsForMatch(teamStats: ITeamStats, match: IMatch, isHome: boolean)
  : ITeamStats {
  const updatedTeamStats = { ...teamStats };

  // Se for partida em casa, use homeTeamGoals; se for fora, use awayTeamGoals
  updatedTeamStats.totalGames += 1;
  const goalsScored = isHome ? match.homeTeamGoals : match.awayTeamGoals;
  const goalsConceded = isHome ? match.awayTeamGoals : match.homeTeamGoals;
  updatedTeamStats.goalsFavor += goalsScored;
  updatedTeamStats.goalsOwn += goalsConceded;

  if ((isHome && match.homeTeamGoals > match.awayTeamGoals)
  || (!isHome && match.awayTeamGoals > match.homeTeamGoals)) {
    updatedTeamStats.totalPoints += 3;
    updatedTeamStats.totalVictories += 1;
  } else if (match.homeTeamGoals === match.awayTeamGoals) {
    updatedTeamStats.totalPoints += 1;
    updatedTeamStats.totalDraws += 1;
  } else { updatedTeamStats.totalLosses += 1; }

  return updatedTeamStats;
}

function sortLeaderboard(a: ITeamStats, b: ITeamStats): number {
  return (
    b.totalPoints - a.totalPoints
    || b.totalVictories - a.totalVictories
    || b.goalsBalance - a.goalsBalance
    || b.goalsFavor - a.goalsFavor
  );
}

async function calculateTeamStats(
  matches: IMatch[],
  teams: ITeam[],
  isHome: boolean,
): Promise<ITeamStats[]> {
  return teams.map((team) => {
    const relevantMatches = matches.filter((match) =>
      (isHome ? match.homeTeamId : match.awayTeamId) === team.id && !match.inProgress);

    const teamStats = relevantMatches.reduce((acc, match) => {
      const updatedStats = updateTeamStatsForMatch(acc, match, isHome);
      updatedStats.name = team.teamName; // Atribuir o nome do time fora da função updateTeamStatsForMatch
      updatedStats.goalsBalance = updatedStats.goalsFavor - updatedStats.goalsOwn;
      updatedStats.efficiency = (
        (updatedStats.totalPoints / (updatedStats.totalGames * 3)) * 100).toFixed(2);
      return updatedStats;
    }, initializeTeamStats());

    return teamStats;
  }).sort(sortLeaderboard); // Usar a função de ordenação aqui
}

async function getHomeLeaderboard() {
  const teams = await getTeams();
  const matches = await getMatches();
  return calculateTeamStats(matches, teams, true);
}

async function getAwayLeaderboard() {
  const teams = await getTeams();
  const matches = await getMatches();
  return calculateTeamStats(matches, teams, false);
}

export default {
  getHomeLeaderboard,
  getAwayLeaderboard,
};
