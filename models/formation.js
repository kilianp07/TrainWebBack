'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Formation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Formation.hasMany(models.FormUserProgress)
      models.Formation.hasMany(models.Chapitre)

    }
  }
  Formation.init({
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Formation',
  });
  return Formation;
};