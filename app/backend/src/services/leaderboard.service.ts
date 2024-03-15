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

function sortLeaderboard(leaderboard: ITeamStats[]): ITeamStats[] {
  return leaderboard.sort((a, b) =>
    b.totalPoints - a.totalPoints
    || b.totalVictories - a.totalVictories
    || b.goalsBalance - a.goalsBalance
    || b.goalsFavor - a.goalsFavor);
}

async function calculateHomeTeamStats(matches: IMatch[], teams: ITeam[]): Promise<ITeamStats[]> {
  const stats = teams.map((team) => {
    const homeMatches = matches
      .filter((match) => match.homeTeamId === team.id && !match.inProgress);

    const teamStats = homeMatches.reduce((acc, match) => {
      const updatedStats = updateTeamStatsForMatch(acc, match);
      updatedStats.name = team.teamName; // Atribuir o nome do time fora da função updateTeamStatsForMatch
      return updatedStats;
    }, initializeTeamStats());

    // Calcular goalsBalance e efficiency
    teamStats.goalsBalance = teamStats.goalsFavor - teamStats.goalsOwn;
    teamStats.efficiency = ((teamStats.totalPoints / (teamStats.totalGames * 3)) * 100).toFixed(2);

    return teamStats;
  });

  return sortLeaderboard(stats); // Usar a função de ordenação aqui
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

async function calculateAwayTeamStats(matches: IMatch[], teams: ITeam[]): Promise<ITeamStats[]> {
  const stats = teams.map((team) => {
    const awayMatches = matches
      .filter((match) => match.awayTeamId === team.id && !match.inProgress);

    const teamStats = awayMatches.reduce((acc, match) => {
      const updatedStats = updateTeamStatsForMatch(acc, match);
      updatedStats.name = team.teamName;
      return updatedStats;
    }, initializeTeamStats());

    // Calcular goalsBalance e efficiency
    teamStats.goalsBalance = teamStats.goalsFavor - teamStats.goalsOwn;
    teamStats.efficiency = ((teamStats.totalPoints / (teamStats.totalGames * 3)) * 100).toFixed(2);

    return teamStats;
  });

  return sortLeaderboard(stats); // Usar a função de ordenação aqui
}

async function getAwayLeaderboard() {
  const teams = await getTeams();
  const matches = await getMatches();

  const leaderboard = await calculateAwayTeamStats(matches, teams);
  // Ordena a classificação conforme critérios definidos
  return sortLeaderboard(leaderboard);
}

export default {
  getHomeLeaderboard,
  getAwayLeaderboard,
};
