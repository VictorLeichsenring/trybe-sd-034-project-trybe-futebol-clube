import { RespType } from '../types/RespService';
import Teams from '../database/models/Team.Model';

async function getAll(): Promise<RespType> {
  const teams = await Teams.findAll();
  return { status: 'successful', data: teams };
}

async function getById(id:number): Promise<RespType> {
  const team = await Teams.findByPk(id);
  if (!team) {
    return { status: 'notFound', data: { message: 'Team not found' } };
  }
  return { status: 'successful', data: team };
}

export default {
  getAll,
  getById,
};
