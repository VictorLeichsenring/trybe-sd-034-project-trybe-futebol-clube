import { Request, Response } from 'express';
import mapStatusHTTP from '../utils/mapStatusHTTP';
import { matchService } from '../services';

async function getAll(req:Request, res: Response) {
  const { status, data } = await matchService.getAll();
  return res.status(mapStatusHTTP(status)).json(data);
}

export default {
  getAll,
};
