import { UserPayload } from './UserPayload';

type TokenPayload = {
  id: number;
  email: string;
};

declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
    }
  }
}
