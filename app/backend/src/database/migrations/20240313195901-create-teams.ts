import { Model, QueryInterface, DataTypes } from "sequelize";

import { TeamType } from '../../types/Team';

export default {
  up(queryInterface: QueryInterface) { 
    return queryInterface.createTable<Model<TeamType>>('teams', { 
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      teamName: {
        allowNull: false,
        type: DataTypes.STRING,
      }
    }) 
  }, 
  down(queryInterface: QueryInterface) {
    return queryInterface.dropTable('teams')
  }
};
