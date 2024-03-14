import { Request, Response, NextFunction } from 'express';
import { TokenPayload } from '../types/types';
import Auth from '../utils/Auth';

// declare module 'express-serve-static-core' {
//   export interface Request {
//     user?: TokenPayload;
//   }
// }

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const bearerToken = req.headers.authorization;
  if (!bearerToken) {
    return res.status(401).json({ message: 'Token not found' });
  }

  const token = bearerToken.split(' ')[1];

  try {
    const decoded = Auth.verify(token) as TokenPayload;
    if (!decoded) {
      return res.status(401).json({ message: 'Token must be a valid token' });
    }
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token must be a valid token' });
  }
};

export default verifyToken;
