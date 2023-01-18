'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class FormUserProgress extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.FormUserProgress.belongsTo(models.User)
      models.FormUserProgress.belongsTo(models.User)
    }
  }
  FormUserProgress.init({
    progress: DataTypes.STRING,
    idUser: DataTypes.INTEGER,
    idFormation: DataTypes.INTEGER,
    isDeleted: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'FormUserProgress',
  });
  return FormUserProgress;
};