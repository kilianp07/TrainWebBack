'use strict';
const {
  Model,
  DataTypes
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.User.hasMany(models.Token)
      models.User.hasMany(models.Logs)
      models.User.hasMany(models.FormUserProgress)
      models.User.hasMany(models.Exercice)
      models.User.hasMany(models.Answer)
    }
  }
  User.init({
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    username: DataTypes.STRING,
    emailVerified: DataTypes.BOOLEAN,
    role: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};

