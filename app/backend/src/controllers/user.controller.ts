import { Request, Response } from 'express';
import mapStatusHTTP from '../utils/mapStatusHTTP';
import { userService } from '../services';

declare module 'express-serve-static-core' {
  interface Request {
    user?: { email: string; id: number; }; // Adapte para refletir seu tipo de usuário
  }
}

async function login(req: Request, res: Response) {
  const { email, password } = req.body;
  const { status, data } = await userService.login(email, password);
  return res.status(mapStatusHTTP(status)).json(data);
}

async function getUserRole(req: Request, res: Response) {
  if (!req.user) return res.status(401).json({ message: 'Authentication required' });
  const { email } = req.user;
  const { status, data } = await userService.getUserRole(email);
  return res.status(mapStatusHTTP(status)).json(data);
}

export default {
  login,
  getUserRole,
};
