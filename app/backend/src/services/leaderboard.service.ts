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

function updateTeamStatsForMatch(teamStats: ITeamStats, match: IMatch): ITeamStats {
  const updatedTeamStats = { ...teamStats };

  updatedTeamStats.totalGames += 1;
  updatedTeamStats.goalsFavor += match.homeTeamGoals;
  updatedTeamStats.goalsOwn += match.awayTeamGoals;

  if (match.homeTeamGoals > match.awayTeamGoals) {
    updatedTeamStats.totalPoints += 3;
    updatedTeamStats.totalVictories += 1;
  } else if (match.homeTeamGoals === match.awayTeamGoals) {
    updatedTeamStats.totalPoints += 1;
    updatedTeamStats.totalDraws += 1;
  } else {
    updatedTeamStats.totalLosses += 1;
  }

  return updatedTeamStats;
}

async function calculateHomeTeamStats(matches: IMatch[], teams: ITeam[]): Promise<ITeamStats[]> {
  return teams.map((team) => {
    const homeMatches = matches
      .filter((match) => match.homeTeamId === team.id && !match.inProgress);

    let stats = homeMatches
      .reduce((acc, match) => updateTeamStatsForMatch(acc, match), initializeTeamStats());

    // Adicionando cálculos de goalsBalance e efficiency
    stats = {
      ...stats,
      name: team.teamName,
      goalsBalance: stats.goalsFavor - stats.goalsOwn,
      efficiency: ((stats.totalPoints / (stats.totalGames * 3)) * 100).toFixed(2),
    };

    return stats;
  }).sort((a, b) => // Ordenando conforme os critérios definidos
    b.totalPoints - a.totalPoints
    || b.totalVictories - a.totalVictories
    || b.goalsBalance - a.goalsBalance
    || b.goalsFavor - a.goalsFavor);
}

async function getHomeLeaderboard() {
  const teams = await getTeams();
  const matches = await getMatches();
  const leaderboard = await calculateHomeTeamStats(matches, teams);

  // Ordena a classificação conforme critérios definidos
  const sortedLeaderboard = leaderboard.sort((a, b) =>
    b.totalPoints - a.totalPoints
    || b.totalVictories - a.totalVictories
    || (b.goalsFavor - b.goalsOwn) - (a.goalsFavor - a.goalsOwn));

  return sortedLeaderboard;
}

export default {
  getHomeLeaderboard,
};
