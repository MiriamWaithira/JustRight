'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Report extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Report.init({
    incidentType: DataTypes.STRING,
    status: DataTypes.STRING,
    description: DataTypes.TEXT,
    location: DataTypes.STRING,
    exactLocation: DataTypes.STRING,
    filePath: DataTypes.STRING,
    publicUserId: DataTypes.INTEGER,
    moderatorId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Report',
  });
  return Report;
};