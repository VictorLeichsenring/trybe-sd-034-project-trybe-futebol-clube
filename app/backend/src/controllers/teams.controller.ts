import { Request, Response } from 'express';
import mapStatusHTTP from '../utils/mapStatusHTTP';
import { teamService } from '../services';

async function getAll(req:Request, res: Response) {
  const { status, data } = await teamService.getAll();
  return res.status(mapStatusHTTP(status)).json(data);
}

async function getById(req:Request, res: Response) {
  const { id } = req.params;
  const { status, data } = await teamService.getById(Number(id));
  return res.status(mapStatusHTTP(status)).json(data);
}

export default {
  getAll,
  getById,
};
