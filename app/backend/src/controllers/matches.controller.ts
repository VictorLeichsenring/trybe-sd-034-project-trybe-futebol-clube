import { Request, Response } from 'express';
import mapStatusHTTP from '../utils/mapStatusHTTP';
import { matchService } from '../services';
import IMatches from '../Interfaces/iMatches';

async function getAll(req: Request, res: Response) {
  const { status, data } = await matchService.getAll();
  const matches = data as IMatches[];

  let filteredMatches;
  if (req.query.inProgress === 'true') {
    filteredMatches = matches.filter((match) => match.inProgress === true);
  } else if (req.query.inProgress === 'false') {
    filteredMatches = matches.filter((match) => match.inProgress === false);
  } else {
    filteredMatches = matches;
  }
  return res.status(mapStatusHTTP(status)).json(filteredMatches);
}

async function finishMatch(req: Request, res: Response) {
  const { id } = req.params;
  const { status, data } = await matchService.finishMatch(Number(id));
  return res.status(mapStatusHTTP(status)).json(data);
}

async function updateMatch(req: Request, res: Response): Promise<Response> {
  const { id } = req.params;
  const { homeTeamGoals, awayTeamGoals } = req.body;
  const matchId = parseInt(id, 10); // Garantindo que o id é um número
  const { status, data } = await matchService.updateMatch(matchId, homeTeamGoals, awayTeamGoals);
  return res.status(mapStatusHTTP(status)).json(data);
}

const extractMatchData = (req: Request) => {
  const { homeTeamId, awayTeamId, homeTeamGoals, awayTeamGoals } = req.body;
  return { homeTeamId, awayTeamId, homeTeamGoals, awayTeamGoals };
};

const createMatch = async (req: Request, res: Response): Promise<Response> => {
  const matchData = extractMatchData(req);
  const { status, data } = await matchService.createMatch(matchData);
  return res.status(mapStatusHTTP(status)).json(data);
};

export default {
  getAll,
  createMatch,
  finishMatch,
  updateMatch,
};
