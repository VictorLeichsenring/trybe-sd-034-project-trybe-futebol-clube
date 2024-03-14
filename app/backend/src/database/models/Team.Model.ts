import { DataTypes, Optional, ModelDefined } from 'sequelize';
import db from './index';

import { TeamType } from '../../types/Team';

export type TeamInputtableFields = Optional<TeamType, 'id'>;

type TeamSequelizeModelCreator = ModelDefined<TeamType, TeamInputtableFields>;

const TeamModel: TeamSequelizeModelCreator = db.define('Team', {
  teamName: DataTypes.STRING,
}, {
  tableName: 'teams',
  timestamps: false,
  underscored: true,
});
export default TeamModel;
