import { Request, Response } from 'express';
import TeamService from '../services';

async function getAll(req:Request, res: Response) {
  const teams = await TeamService.getAll();
  return res.status(200).json(teams);
}

export default getAll;
