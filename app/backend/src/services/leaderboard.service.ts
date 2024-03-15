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

async function calculateGeneralTeamStats(
  matches: IMatch[],
  teams: ITeam[],
): Promise<ITeamStats[]> {
  return teams.map((team) => {
    const relevantMatches = matches.filter((match) =>
      (!match.inProgress) && (match.homeTeamId === team.id || match.awayTeamId === team.id));

    const teamStats = relevantMatches.reduce((acc, match) => {
      const isHome = match.homeTeamId === team.id;
      const updatedStats = updateTeamStatsForMatch(acc, match, isHome);
      // Certifique-se de que teamName esteja acessível como esperado, ajuste conforme sua estrutura de dados
      updatedStats.name = team.teamName;
      updatedStats.goalsBalance = updatedStats.goalsFavor - updatedStats.goalsOwn;
      updatedStats.efficiency = (
        (updatedStats.totalPoints / (updatedStats.totalGames * 3)) * 100).toFixed(2);
      return updatedStats;
    }, initializeTeamStats());

    return teamStats;
  }).sort(sortLeaderboard); // Use sua função de ordenação existente
}

async function getGeneralLeaderboard() {
  const teams = await getTeams(); // Assume que esta função retorna todos os times
  const matches = await getMatches(); // Assume que esta função retorna todas as partidas finalizadas
  return calculateGeneralTeamStats(matches, teams);
  // const teamStats = teams.map((team) => {
  //   // console.log(team.dataValues.teamName)
  //   const stats = initializeTeamStats(); // Inicialize suas estatísticas
  //   stats.name = team.dataValues.teamName;
  //   matches.forEach((match) => {
  //     if (match.inProgress) return; // Ignora partidas em andamento

  //     const isHomeTeam = match.homeTeamId === team.id;
  //     const isAwayTeam = match.awayTeamId === team.id;

  //     if (isHomeTeam || isAwayTeam) {
  //       const goalsScored = isHomeTeam ? match.homeTeamGoals : match.awayTeamGoals;
  //       const goalsConceded = isHomeTeam ? match.awayTeamGoals : match.homeTeamGoals;
  //       const won = goalsScored > goalsConceded;
  //       const drawn = goalsScored === goalsConceded;

  //       // Atualiza as estatísticas baseando-se nos resultados
  //       stats.totalGames += 1;
  //       stats.goalsFavor += goalsScored;
  //       stats.goalsOwn += goalsConceded;
  //       stats.goalsBalance = stats.goalsFavor - stats.goalsOwn;

  //       if (won) {
  //         stats.totalPoints += 3;
  //         stats.totalVictories += 1;
  //       } else if (drawn) {
  //         stats.totalPoints += 1;
  //         stats.totalDraws += 1;
  //       } else {
  //         stats.totalLosses += 1;
  //       }

  //       stats.efficiency = ((stats.totalPoints / (stats.totalGames * 3)) * 100).toFixed(2);
  //     }
  //   });

  //   return stats;
  // }).sort(sortLeaderboard); // Utilize a função de ordenação conforme especificado

  // return teamStats;
}

export default {
  getHomeLeaderboard,
  getAwayLeaderboard,
  getGeneralLeaderboard,
};
