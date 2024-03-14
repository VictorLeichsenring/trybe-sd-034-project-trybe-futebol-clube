import { Request, Response } from 'express';
import mapStatusHTTP from '../utils/mapStatusHTTP';
import { userService } from '../services';

async function login(req:Request, res: Response) {
  const { email, password } = req.body;
  const { status, data } = await userService.login(email, password);
  return res.status(mapStatusHTTP(status)).json(data);
}

export default { login };
