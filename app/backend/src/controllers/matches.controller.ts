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

export default {
  getAll,
  finishMatch,
};
