'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Logs extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.Logs.belongsTo(models.User)
    }
  }
  Logs.init({
    value: DataTypes.STRING,
    idUser: DataTypes.INTEGER,
    isDeleted: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Logs',
  });

  Logs.incomingCorrectlyFilled = (incomingLogs)=>{
    return incomingLogs.value != null &&
    incomingLogs.idUser != null
  }

  return Logs;
};