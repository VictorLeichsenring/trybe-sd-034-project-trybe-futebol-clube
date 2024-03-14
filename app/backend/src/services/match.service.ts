import { RespType } from '../types/RespService';
import Matches from '../database/models/Match.Model';
import Teams from '../database/models/Team.Model';

const getAll = async (): Promise<RespType> => {
  const matches = await Matches.findAll();
  const teams = await Teams.findAll();
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

const finishMatch = async (matchId: number): Promise<RespType> => {
  const match = await Matches.findByPk(matchId);
  if (!match) {
    return { status: 'error', data: { message: 'Match not found' } };
  }
  if (!match.inProgress) {
    return { status: 'error', data: { message: 'Match is already finished' } };
  }
  await match.update({ inProgress: false });
  return { status: 'successful', data: { message: 'Finished' } };
};

const updateMatch = async (
  matchId: number,
  homeTeamGoals: number,
  awayTeamGoals: number,
): Promise<RespType> => {
  const match = await Matches.findByPk(matchId);
  if (!match) {
    return { status: 'error', data: { message: 'Match not found' } };
  }
  if (!match.inProgress) {
    return { status: 'error', data: { message: 'Match is not in progress' } };
  }
  await match.update({ homeTeamGoals, awayTeamGoals });
  return { status: 'successful', data: { message: 'Match updated successfully' } };
};

interface CreateMatchData {
  homeTeamId: number;
  awayTeamId: number;
  homeTeamGoals: number;
  awayTeamGoals: number;
}

interface ValidationData {
  homeTeamId: number;
  awayTeamId: number;
}

async function validateTeamsExistence({ homeTeamId,
  awayTeamId }: ValidationData): Promise<RespType | null> {
  // Verifica se os IDs dos times são iguais
  if (homeTeamId === awayTeamId) {
    const validationError = 'It is not possible to create a match with two equal teams';
    return { status: 'invalidValue', data: { message: validationError } };
  }

  // Verifica a existência do time da casa
  const homeTeamExists = await Teams.findByPk(homeTeamId);
  if (!homeTeamExists) {
    const validationError = 'There is no team with such id!';
    return { status: 'notFound', data: { message: validationError } };
  }

  // Verifica a existência do time visitante
  const awayTeamExists = await Teams.findByPk(awayTeamId);
  if (!awayTeamExists) {
    const validationError = 'There is no team with such id!';
    return { status: 'notFound', data: { message: validationError } };
  }

  // Se todas as verificações passarem, retorna null
  return null;
}
const insertMatch = async (data: CreateMatchData): Promise<Matches> => {
  const newMatch = await Matches.create({
    ...data,
    inProgress: true,
  });
  return newMatch;
};

// const createMatch = async (data: CreateMatchData): Promise<RespType> => {
//   // const { homeTeamId, awayTeamId } = data;
//   // const validationError = await validateTeamsExistence({ homeTeamId, awayTeamId });
//   // if (validationError) {
//   //   return validationError;
//   // }
//   const newMatch = await insertMatch(data);
//   return {
//     status: 'created',
//     data: {
//       id: newMatch.id,
//       homeTeamId: newMatch.homeTeamId,
//       homeTeamGoals: newMatch.homeTeamGoals,
//       awayTeamId: newMatch.awayTeamId,
//       awayTeamGoals: newMatch.awayTeamGoals,
//       inProgress: newMatch.inProgress,
//     },
//   };
// };

const createMatch = async (data: CreateMatchData): Promise<RespType> => {
  const { homeTeamId, awayTeamId } = data;
  const validationError = await validateTeamsExistence({ homeTeamId, awayTeamId });
  if (validationError) {
    return validationError;
  }
  const newMatch = await insertMatch(data);
  return { status: 'created', data: newMatch };
};

export default {
  getAll,
  finishMatch,
  updateMatch,
  createMatch,
};
