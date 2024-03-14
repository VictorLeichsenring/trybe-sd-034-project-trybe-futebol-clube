import * as jwt from 'jsonwebtoken';

const { JWT_SECRET } = process.env;
const JWT_CONFIG = {
  algorithm: 'HS256',
  expiresIn: '1d',
};

const createToken = (payload: object) => {
  const token = jwt.sign(payload, JWT_SECRET as string, JWT_CONFIG as object);
  return token;
};

const verify = (token: string) => {
  const payload = jwt.verify(token, JWT_SECRET as string);
  return payload;
};

export default {
  createToken,
  verify,
};
