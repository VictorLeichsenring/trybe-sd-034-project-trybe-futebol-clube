import { RespType } from '../types/RespService';
import Matches from '../database/models/Match.Model';

async function getAll(): Promise<RespType> {
  const matches = await Matches.findAll();
  return { status: 'successful', data: matches };
}

export default {
  getAll,
};
