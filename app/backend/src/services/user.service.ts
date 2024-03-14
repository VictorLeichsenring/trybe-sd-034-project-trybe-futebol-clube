import * as bcrypt from 'bcryptjs';
import Auth from '../utils/Auth';
import { RespType } from '../types/RespService';
import Users from '../database/models/User.Model';

async function getByEmail(email:string): Promise<RespType> {
  const user = await Users.findOne({
    where: { email },
    attributes: { exclude: ['password'] },
  });
  if (!user) return { status: 'NOT_FOUND', data: { message: 'User does not exist' } };
  return { status: 'successful', data: user };
}

const isEmailValid = (email: string) => {
  const emailRegex = /\S+@\S+\.\S+/;
  return emailRegex.test(email);
};

const unauthorizedMessage = 'Invalid email or password';
async function login(email: string, password:string): Promise<RespType> {
  if (!email || !password) {
    return { status: 'badRequest', data: { message: 'All fields must be filled' } };
  }
  if (!isEmailValid(email)) {
    return { status: 'unauthorized', data: { message: unauthorizedMessage } };
  }
  const user = await Users.findOne({ where: { email } });
  if (!user) {
    return { status: 'unauthorized', data: { message: unauthorizedMessage } };
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return { status: 'unauthorized', data: { message: unauthorizedMessage } };
  }

  const token = Auth.createToken({ id: user.id, email: user.email });
  return { status: 'successful', data: { token } };
}

export default {
  getByEmail,
  login,
};
