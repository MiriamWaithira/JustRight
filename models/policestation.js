'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PoliceStation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  PoliceStation.init({
    stationName: DataTypes.STRING,
    contact: DataTypes.STRING,
    location: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'PoliceStation',
  });
  return PoliceStation;
};